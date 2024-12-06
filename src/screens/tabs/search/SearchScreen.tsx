import {
    View,
    Text,
    SafeAreaView,
    Pressable,
    ActivityIndicator,
    FlatList,
    TextInput,
} from "react-native";
import React, { useCallback, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SearchCoin } from "@/utils/cryptoapi";
import { debounce } from "lodash";
import { XMarkIcon } from "react-native-heroicons/outline";
import Animated, { FadeInDown } from "react-native-reanimated";
import numeral from "numeral";

interface Coin {
    uuid: string;
    name: string;
    symbol: string;
    iconUrl: string;
    price: string;
    change: number;
    marketCap: string;
}

const SearchScreen = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Coin[]>([]);

    const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation();
    const { navigate: navigateHome }: NavigationProp<HomeNavigationType> = useNavigation();

    const handleSearch = async (search: string) => {
        if (search.length > 2) {
            setLoading(true);
            try {
                const response = await SearchCoin(search);
                console.log("API Response:", response); // Kiểm tra dữ liệu trả về
                setResults(response?.data?.coins || []); // Đảm bảo chỉ lấy `coins`
            } catch (error) {
                console.error("Error fetching search results:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        } else {
            setResults([]); // Xóa kết quả khi chuỗi tìm kiếm quá ngắn
        }
    };

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    const renderItem = ({ item, index }: { item: Coin; index: number }) => {
        if (!item) return null;

        // Kiểm tra và đảm bảo rằng `change` là số và hợp lệ
        const change = isNaN(item.change) ? 0 : item.change;

        return (
            <Pressable
                className="flex-row w-full py-4 items-center px-4"
                onPress={() => navigate("CoinDetails", { coinUuid: item.uuid })}
                key={item.uuid}
            >
                <Animated.View
                    entering={FadeInDown.duration(100).delay(index * 200).springify()}
                    className="w-full flex-row items-center"
                >
                    {/* Symbol */}
                    <View className="w-[16%]">
                        <View className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center">
                            <Text className="text-xs font-bold">
                                {item.symbol?.substring(0, 2).toUpperCase() || ""}
                            </Text>
                        </View>
                    </View>

                    {/* Name and Price */}
                    <View className="w-[55%] justify-start items-start">
                        <Text className="font-bold text-lg">{item.name || "N/A"}</Text>
                        <View className="flex-row justify-center items-center space-x-4">
                            <Text className="font-medium text-sm text-neutral-500">
                                {numeral(parseFloat(item.price || "0")).format("$0,0.00")}
                            </Text>
                        </View>
                    </View>

                    {/* Market Cap */}
                    <View className="w-[29%] justify-start items-end">
                        <Text className="font-bold text-base">{item.symbol || "N/A"}</Text>
                        <View className="flex-row justify-center items-center space-x-2">
                            <Text className="font-medium text-sm text-neutral-500">
                                {item.marketCap?.length > 9
                                    ? item.marketCap.slice(0, 9)
                                    : item.marketCap || ""}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="bg-white flex-1">
            {/* Header */}
            <View className="w-full flex-row justify-start items-center px-4 pb-7 pt-8">
                <Text className="mt-2 text-3xl font-bold">Search</Text>
            </View>
            {/* Search Field */}
            <View className="mx-4 mb-3 flex-row p-2 border-2 justify-between items-center bg-white rounded-lg shadow-sm">
                <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="Search for your coins"
                    placeholderTextColor="gray"
                    className="pl-2 flex-1 font-medium text-black tracking-wider"
                />
                <Pressable onPress={() => navigateHome("HomeScreen")}>
                    <XMarkIcon size="25" color="black" />
                </Pressable>
            </View>

            {/* Results */}
            <View className="mt-4 flex-1">
                {loading ? (
                    <ActivityIndicator size="large" color="#164bd8" />
                ) : results.length > 0 ? (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.uuid}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <Text className="text-center text-gray-500">No results found.</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SearchScreen;

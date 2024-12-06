import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { FetchCryptoNews } from '@/utils/cryptoapi';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BookmarkSquareIcon } from 'react-native-heroicons/outline';

const NewsScreen = () => {
    const { data: NewsData, isLoading: IsNewsLoading } = useQuery({
        queryKey: ["cryptonews"],
        queryFn: FetchCryptoNews,
    });

    const navigation = useNavigation();

    const handleClick = (item) => {
        navigation.navigate("NewsDetails", item);
    };

    const renderItem = ({ item, index }) => {
        return (
            <Pressable
                className="mb-4 mx-4 space-y-1"
                key={index}
                onPress={() => handleClick(item)}
            >
                <View className="flex-row justify-start w-full shadow-sm bg-white rounded-lg">
                    {/* Image */}
                    <View className="items-start justify-start w-[20%]">
                        <Image
                            source={{ uri: item.thumbnail }}
                            style={{ width: hp(9), height: hp(10) }}
                            resizeMode="cover"
                            className="rounded-lg"
                        />
                    </View>

                    {/* Content */}
                    <View className="w-[70%] pl-4 justify-center space-y-1">
                        {/* Title */}
                        <Text className="text-base font-bold text-black">
                            {item.title?.length > 30 ? `${item.title.slice(0, 30)}...` : item.title}
                        </Text>

                        {/* Description */}
                        <Text className="text-sm text-gray-700">
                            {item.description?.length > 50
                                ? `${item.description.slice(0, 50)}...`
                                : item.description}
                        </Text>

                        {/* Date */}
                        <Text className="text-xs text-gray-700">
                            {item.createdAt}
                        </Text>
                    </View>

                    {/* Bookmark */}
                    <View className="w-[10%] justify-center">
                        <BookmarkSquareIcon color="gray" />
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="space-y-2 bg-white flex-1">
            {/* Header */}
            <View className="w-full flex-row justify-between items-center px-4 pb-4">
                <View className="w-3/4 flex-row space-x-2">
                    <Text className="text-3xl font-bold text-black">Crypto News</Text>
                </View>
            </View>

            {/* Main News */}
            <View>
                {IsNewsLoading ? (
                    <ActivityIndicator size="large" color="black" />
                ) : NewsData && NewsData.data && NewsData.data.length > 0 ? (
                    <FlatList
                        data={NewsData.data}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-lg text-gray-500">No news available</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default NewsScreen;

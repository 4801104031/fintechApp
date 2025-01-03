import { View, Text, Pressable, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { FetchAllCoins } from "../../../../utils/cryptoapi"
import Animated, { FadeInDown } from 'react-native-reanimated';
import numeral from "numeral"
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';

interface Coin {
    uuid: string;
    name: string;
    symbol: string;
    iconUrl: string;
    price: string;
    change: number;
    marketCap: string;
}


export default function MarketScreen({ }) {
    const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation();
    const [topGainers, setTopGainers] = useState([])
    const [topLoser, setTopLoser] = useState([])
    const [active, setActive] = useState("all")

    const allCoins = () => {
        setActive("all")
    }



    const calculateTopGainers = () => {
        setActive("gainers")
        const gainers = CoinsData.data.coins.filter(
            (coin) => parseFloat(coin.change) > 0
        )
        setTopGainers(gainers)
    }
    const calculateTopLoser = () => {
        setActive("losers")
        const losers = CoinsData.data.coins.filter(
            (coin) => parseFloat(coin.change) < 0
        )
        setTopLoser(losers)
    }

    const { data: CoinsData, isLoading: IsAllCoinsLoading } = useQuery({
        queryKey: ["allCoins"],
        queryFn: FetchAllCoins,
    })


    const renderItem = ({ item, index }: { item: Coin; index: number }) => {
        return (
            <Pressable className="flex-row w-full py-4 items-center"
                onPress={() => navigate("CoinDetails", { coinUuid: item.uuid })}
            >
                <Animated.View
                    entering={FadeInDown.duration(100).delay(index * 200).springify()}
                    className="w-full flex-row items-center"
                >
                    <View className="w-[16%]">
                        <View>
                            <View className="w-10 h-10">
                                <View className="w-full h-full bg-gray-200 rounded-full justify-center items-center">
                                    <Text className="text-xs font-bold">
                                        {item.symbol.substring(0, 2).toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="w-[55%] justify-start items-start">
                        <Text className="font-bold text-lg">{item.name}</Text>
                        <View className="flex-row justify-center items-center space-x-4">
                            <Text className="font-medium text-sm text-neutral-500">
                                {numeral(parseFloat(item?.price)).format("$0,0.00")}
                            </Text>
                            <Text
                                className={`font-medium text-sm ${item.change < 0
                                    ? "text-red-600"
                                    : item.change > 0
                                        ? "text-green-600"
                                        : "text-gray-600"
                                    }`}
                                style={{ marginLeft: 8 }} // Add margin to create space
                            >
                                {item.change}%
                            </Text>
                        </View>
                    </View>

                    <View className="w-[29%] justify-start items-end">
                        <Text className="font-bold text-base"> {item.symbol}</Text>
                        <View className="flex-row justify-center items-center space-x-2">
                            <Text className="font-medium text-sm text-neutral-500">
                                {item.marketCap.length > 9
                                    ? item.marketCap.slice(0, 9)
                                    : item.marketCap}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        );
    };


    // console.log({
    //   CoinsData
    // })
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='relative'>
                {/* Header */}
                <View className='w-full flex-row justify-start items-center px-4 pb-4'>
                    <View className='w-3/4'>
                        <Text className='text-3xl font-bold'>
                            Market
                        </Text>
                    </View>
                </View>
                {/* Balance */}
                <View className='px-4 flex-row justify-between items-center pb-4'>



                    {/* all */}
                    <Pressable
                        className={
                            `w-1/4 justify-center items-center py-1 ${active === "all" ? "border-b-4 border-blue-500" : ""}`
                        }
                        onPress={allCoins}>
                        <Text className={
                            `text-lg ${active === "all" ? "font-extrabold" : ""}`
                        }>
                            All
                        </Text>

                    </Pressable>
                    {/* gainers */}
                    <Pressable
                        className={
                            `w-1/4 justify-center items-center py-1 ${active === "gainers" ? "border-b-4 border-blue-500" : ""}`
                        }
                        onPress={calculateTopGainers}>
                        <Text className={
                            `text-lg ${active === "gainers" ? "font-extrabold" : ""}`
                        }>
                            Gainers
                        </Text>

                    </Pressable>

                    {/* loser */}
                    <Pressable
                        className={
                            `w-1/4 justify-center items-center py-1 ${active === "losers" ? "border-b-4 border-blue-500" : ""}`
                        }
                        onPress={calculateTopLoser}>
                        <Text className={
                            `text-lg ${active === "losers" ? "font-extrabold" : ""}`
                        }>
                            Losers
                        </Text>

                    </Pressable>

                </View>

                {/* Coin */}
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className='px-4 py-8 items-center'>
                        {/* ALl */}
                        {
                            active === "all" && (
                                <View className='px-4 items-center'>
                                    {
                                        IsAllCoinsLoading ? (<ActivityIndicator size="large" color="black" />

                                        ) : (
                                            <FlatList
                                                nestedScrollEnabled={true}
                                                scrollEnabled={false}
                                                data={CoinsData.data.coins}
                                                keyExtractor={(item) => item.uuid}
                                                renderItem={renderItem}
                                                showsVerticalScrollIndicator={false}
                                            />
                                        )
                                    }
                                </View>
                            )
                        }

                        {/* Gainers */}
                        {
                            active === "gainers" && (
                                <View className='px-4 items-center'>
                                    {
                                        IsAllCoinsLoading ? (<ActivityIndicator size="large" color="black" />

                                        ) : (
                                            <FlatList
                                                nestedScrollEnabled={true}
                                                scrollEnabled={false}
                                                data={active === 'gainers'
                                                    ? topGainers : CoinsData.data.coins

                                                }
                                                keyExtractor={(item) => item.uuid}
                                                renderItem={renderItem}
                                                showsVerticalScrollIndicator={false}
                                            />
                                        )
                                    }
                                </View>
                            )
                        }
                        {/* Losers */}
                        {
                            active === "losers" && (
                                <View className='px-4 items-center'>
                                    {
                                        IsAllCoinsLoading ? (<ActivityIndicator size="large" color="black" />

                                        ) : (
                                            <FlatList
                                                nestedScrollEnabled={true}
                                                scrollEnabled={false}
                                                data={active === 'losers'
                                                    ? topLoser : CoinsData.data.coins}
                                                keyExtractor={(item) => item.uuid}
                                                renderItem={renderItem}
                                                showsVerticalScrollIndicator={false}
                                            />
                                        )
                                    }
                                </View>
                            )
                        }


                    </View>
                </ScrollView>

            </View>
        </SafeAreaView>
    );
}

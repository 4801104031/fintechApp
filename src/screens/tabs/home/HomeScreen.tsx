import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '@/src/components/Avatar';
import useSupabaseAuth from '@/hooks/useSupabaseAuth';
import { useUserStore } from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import {FetchAllCoins} from "../../../../utils/cryptoapi"
import Animated, { FadeInDown } from 'react-native-reanimated';
import numeral from "numeral"
import { FlatList, ScrollView } from 'react-native-gesture-handler';

interface Coin{
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: string;
  change: number;
  marketCap: string;

}


export default function HomeScreen() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { getUserProfile } = useSupabaseAuth();
  const { session } = useUserStore();
  const handleGetProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error, status } = await getUserProfile();
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUserName(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [getUserProfile]);

  useEffect(() => {
    if (session) {
      handleGetProfile();
    }
  }, [session, handleGetProfile]);
  const {data: CoinsData, isLoading: IsAllCoinsLoading} = useQuery({
    queryKey:["allCoins"],
    queryFn: FetchAllCoins,
  })

  const renderItem = ({ item, index }: { item: Coin; index: number }) => {
    return (
      <Pressable className="flex-row w-full py-4 items-center"
      onPress={() => navigate("CoinDetails",{coinUuid: item.uuid})}
      >
        <Animated.View
          entering={FadeInDown.duration(100).delay(index * 200).springify()}
          className="w-full flex-row items-center"
        >
          <View className="w-[16%]">
            <View>
              <View className="w-10 h-10">
              <View 
              className="w-full h-full bg-gray-200 rounded-full justify-center items-center"
            >
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
              <Text className={`font-medium text-sm text-neutral-500`}>
                {numeral(parseFloat(item?.price)).format("&0,0.00")}
              </Text>
              <Text
                className={`font-medium text-sm ${
                  item.change < 0
                    ? "text-red-600"
                    : item.change > 0
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
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
        <View className='w-full flex-row justify-between items-center px-4'>
          <View className='w-3/4 flex-row space-x-2'>
            <View className='justify-center items-center'>
              <Avatar
                url={avatarUrl}
                size={48}
              />
            </View>
            <View>
              <Text className='text-lg font-bold'>
                Chào, {username || "User"}
              </Text>
              <Text className='text-sm text-neutral-500'>Chúc bạn một ngày tốt lành</Text>
            </View>
          </View>

          <View className='py-6'>
            <View className='bg-neutral-700 rounded-lg p-1'>
              <Ionicons name='menu' size={24} color="white" />
            </View>
          </View>
        </View>
        {/* Balance */}
        <View className='mx-4 bg-neutral-800 rounded-[34px] overflow-hidden mt-4 mb-4'>
          <View className='bg-[#0DF69E] justify-center items-center py-6 rounded-[34px]'>
            <Text className='text-sm font-medium text-neutral-700'>
              Tổng số dư
            </Text>
            <Text className='text-3xl font-extrabold'>$2,400.00</Text>
          </View>
          <View className='justify-between items-center flex-row py-4'>

            {/* sendto */}
            <View className='w-1/4 justify-center items-center space-y-4'>
              <View className='w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2'>
                <Image source={require("../../../../assets/images/money-send.png")}
                  className="w-full h-full flex-1"
                />

              </View>

              <Text className='text-white'>
                Gửi tới
              </Text>
            </View>
             {/* request */}
             <View className='w-1/4 justify-center items-center space-y-4'>
              <View className='w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2'>
                <Image source={require("../../../../assets/images/money-receive.png")}
                  className="w-full h-full flex-1"
                />

              </View>

              <Text className='text-white'>
                Yêu cầu
              </Text>
            </View>
            {/* topup*/}
            <View className='w-1/4 justify-center items-center space-y-4'>
              <View className='w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2'>
                <Image source={require("../../../../assets/images/card-add.png")}
                  className="w-full h-full flex-1"
                />

              </View>

              <Text className='text-white'>
                Nạp tiền
              </Text>
            </View>
            {/* more */}
            <View className='w-1/4 justify-center items-center space-y-4'>
              <View className='w-10 h-10 overflow-hidden bg-[#3B363F] rounded-full p-2'>
                <Image source={require("../../../../assets/images/more.png")}
                  className="w-full h-full flex-1"
                />

              </View>

              <Text className='text-white'>
                Khác
              </Text>
            </View>
          </View>
        </View>

        {/* Coin */}
        <ScrollView
        contentContainerStyle={{paddingBottom:100}}
        showsVerticalScrollIndicator={false}
        >
          <View className='px-4 py-8 items-center'>
        {
          IsAllCoinsLoading ? (<ActivityIndicator size="large" color="black" />
            
          ) : (
            <FlatList
            nestedScrollEnabled={true}
            scrollEnabled={false}
            data={CoinsData.data.coins}
            keyExtractor={(item) => item.uuid}
            renderItem={renderItem} // Hàm `renderItem` phải trả về React element
            showsVerticalScrollIndicator={false}
            />
          )
        }
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import numeral from 'numeral';
import { FetchCoinDetails, FetchCoinHistory } from '@/utils/cryptoapi';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { Circle, useFont } from '@shopify/react-native-skia';
import Animated, { SharedValue } from 'react-native-reanimated';

export default function CoinDetailsScreen() {
  const [lineData, setLineData] = useState<any[]>([]);
  const [item, setItem] = useState<any>({});
  const navigation = useNavigation();
  const {
    params: { coinUuid },
  } = useRoute();

  const font = useFont(
    require('../../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    12
  );

  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
    return <Circle cx={x} cy={y} r={8} color="red" />;
  }

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const { data: CoinsDetails, isLoading: CoinsDetailsLoading } = useQuery({
    queryKey: ['CoinDetails', coinUuid],
    queryFn: () => coinUuid && FetchCoinDetails(coinUuid),
  });

  const { data: CoinsHistory, isLoading: CoinsHistoryLoading } = useQuery({
    queryKey: ['CoinHistory', coinUuid],
    queryFn: () => coinUuid && FetchCoinHistory(coinUuid),
  });

  useEffect(() => {
    if (CoinsHistory && CoinsHistory.data.history) {
      const datasets = CoinsHistory.data.history.map((items: any) => ({
        price: parseFloat(items.price),
        timeStamp: items.timestamp,
      }));

      setLineData(datasets);
    }
    if (CoinsDetails && CoinsDetails.data.coin) {
      setItem(CoinsDetails.data.coin);
    }
  }, [CoinsDetails, CoinsHistory]);

  return (
    <View className="flex-1">
      {CoinsDetailsLoading || CoinsHistoryLoading ? (
        <View className="absolute z-50 h-full w-full justify-start items-center">
          <View className='w-full h-full justify-center items-center bg-black opacity-[0.45px]'>
          </View>
          <View className='absolute'>
            <ActivityIndicator size="large" color="white" />

          </View>
        </View>
      ) : (
        <SafeAreaView>
          <View className='flex-row items-center justify-between px-4'>
            <Pressable className='border-2 border-neutral-500 rounded-full p-1'
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="keyboard-arrow-left"
                size={24}
                color="gray"
              />
            </Pressable>


            <View>
              <Text className='font-bold text-lg '>{item.symbol}</Text>
            </View>
            <View className='border-2 border-neutral-500 rounded-full p-1'>
              <Entypo name='dots-three-horizontal' size={24} color="gray" />
            </View>
          </View>

          <View className='px-4 justify-center items-center py-2'>
            <Text className="font-extrabold text-2xl">
              {numeral(parseFloat(item?.price)).format("$0,0.00")}
            </Text>
          </View>
          {
            item && (
              <View className="flex-row justify-between items-center px-4 py-4 bg-gray-100 rounded-lg">
                {/* Logo */}
                <View className="w-[16%]">
                  <View className="w-12 h-12 bg-gray-200 rounded-full justify-center items-center">
                    <Text className="text-sm font-bold text-gray-700">
                      {item.symbol?.substring(0, 2).toUpperCase() || "--"}
                    </Text>
                  </View>
                </View>

                {/* Thông tin đồng tiền và MarketCap */}
                <View className="flex-1 flex-row justify-between items-center">
                  {/* Thông tin đồng tiền */}
                  <View className="w-[70%]">
                    {/* Tên đồng tiền */}
                    <Text className="font-bold text-lg text-black">
                      {item.name || "Unknown Coin"}
                    </Text>

                    {/* Giá và thay đổi */}
                    <View className="flex-row items-center mt-1">
                      {/* Giá */}
                      <Text className="font-medium text-sm text-gray-700">
                        {numeral(parseFloat(item?.price) || 0).format("$0,0.00")}
                      </Text>

                      {/* Thay đổi (tăng/giảm) */}
                      <Text
                        className={`font-medium text-sm ml-2 ${item.change < 0
                          ? "text-red-600"
                          : item.change > 0
                            ? "text-green-600"
                            : "text-gray-600"
                          }`}
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change || "0"}%
                      </Text>
                    </View>
                  </View>

                  {/* MarketCap */}
                  <View className="w-[30%] items-end">
                    <Text className="font-bold text-base text-gray-700">
                      {item.symbol}
                    </Text>
                    <Text className="font-medium text-sm text-gray-500">
                      {item?.marketCap?.length > 9
                        ? item.marketCap.slice(0, 9)
                        : item.marketCap}
                    </Text>
                  </View>
                </View>
              </View>
            )
          }
        </SafeAreaView>
      )}
      <View style={{ height: 400, paddingHorizontal: 10 }}>
        {lineData && lineData.length > 0 && (
          <CartesianChart
            chartPressState={state}
            axisOptions={{
              font,
              tickCount: 8,
              labelOffset: { x: -1, y: 0 },
              labelColor: "green",
              formatXLabel: (ms) =>
                ms ? format(new Date(ms * 1000), "MM/dd") : "N/A", // Kiểm tra giá trị trước khi định dạng
            }}
            data={lineData}
            xKey="timeStamp"
            yKeys={["price"]}
          >
            {({ points }) => (
              <>
                <Line points={points.price || []} color="green" strokeWidth={2} />
                {isActive && state.x && state.y && (
                  <ToolTip
                    x={state.x.position || 0}
                    y={state.y.price?.position || 0}
                  />
                )}
              </>
            )}
          </CartesianChart>
        )}
      </View>
      <View className='px-4 py-4'>
        {/* alltimehigh */}
        <View className='flex-row justify-between'>
          <Text className='text-base font-bold text-neutral-500'>
            All Time High</Text>
          <Text className="font-bold text-base">
            {numeral(parseFloat(item?.allTimeHigh?.price)).format("$0,0.00")}
          </Text>
        </View>
        {/* number of market */}
        <View className='flex-row justify-between'>
          <Text className='text-base font-bold text-neutral-500'>
            Number of Markets</Text>
          <Text className="font-bold text-base">
            {numeral(parseFloat(item?.numberOfMarkets)).format("$0,0.00")}
          </Text>
        </View>
        {/* number of exchange */}
        <View className='flex-row justify-between'>
          <Text className='text-base font-bold text-neutral-500'>
            Number of Exchanges</Text>
          <Text className="font-bold text-base">
            {numeral(parseFloat(item?.numberOfExchanges)).format("$0,0.00")}
          </Text>
        </View>
      </View>
    </View>
  )
}
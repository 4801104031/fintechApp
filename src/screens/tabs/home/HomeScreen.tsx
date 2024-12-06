import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, FlatList, ScrollView, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '@/src/components/Avatar';
import useSupabaseAuth from '@/hooks/useSupabaseAuth';
import { useUserStore } from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { FetchAllCoins } from "../../../../utils/cryptoapi";
import Animated, { FadeInDown } from 'react-native-reanimated';
import numeral from "numeral";
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

export default function HomeScreen() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [coinAmount, setCoinAmount] = useState("1");
  const [showPicker, setShowPicker] = useState(false);
  const { getUserProfile } = useSupabaseAuth();
  const { session } = useUserStore();
  const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation();

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

  useFocusEffect(
    useCallback(() => {
      if (session) {
        handleGetProfile();
      }
    }, [session, handleGetProfile])
  );

  const { data: CoinsData, isLoading: IsAllCoinsLoading } = useQuery({
    queryKey: ["allCoins"],
    queryFn: FetchAllCoins,
  });

  const renderItem = ({ item, index }: { item: Coin; index: number }) => {
    return (
      <Pressable 
        style={styles.coinItem}
        onPress={() => navigate("CoinDetails", { coinUuid: item.uuid })}
      >
        <Animated.View
          entering={FadeInDown.duration(100).delay(index * 200).springify()}
          style={styles.coinItemContent}
        >
          <View style={styles.coinSymbolContainer}>
            <View style={styles.coinSymbol}>
              <Text style={styles.coinSymbolText}>
                {item.symbol.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.coinInfo}>
            <Text style={styles.coinName}>{item.name}</Text>
            <View style={styles.coinPriceContainer}>
              <Text style={styles.coinPrice}>
                {numeral(parseFloat(item?.price)).format("$0,0.00")}
              </Text>
              <Text
                style={[
                  styles.coinChange,
                  item.change < 0 ? styles.negativeChange : item.change > 0 ? styles.positiveChange : {}
                ]}
              >
                {item.change}%
              </Text>
            </View>
          </View>

          <View style={styles.coinMarketCap}>
            <Text style={styles.coinSymbolText}>{item.symbol}</Text>
            <Text style={styles.marketCapText}>
              {item.marketCap.length > 9
                ? item.marketCap.slice(0, 9)
                : item.marketCap}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  const renderPickerItem = ({ item }: { item: Coin }) => (
    <TouchableOpacity
      style={styles.pickerItem}
      onPress={() => {
        setSelectedCoin(item.symbol);
        setShowPicker(false);
      }}
    >
      <Text style={styles.pickerItemText}>{item.symbol} - {item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Avatar
                url={avatarUrl}
                size={48}
              />
            </View>
            <View>
              <Text style={styles.username}>
                Hi, {username || "User"}
              </Text>
              <Text style={styles.greeting}>Have a good day</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name='menu' size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Coin List Header */}
        <View style={styles.coinListHeader}>
          <Text style={styles.coinListHeaderText}>Coin List</Text>
        </View>

        {/* Coin Value Calculator */}
        <View style={styles.calculatorCard}>
          <Text style={styles.calculatorTitle}>
            Coin Value Calculator
          </Text>
          <View style={styles.calculatorInputs}>
            <TextInput
              style={styles.amountInput}
              value={coinAmount}
              onChangeText={setCoinAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
            />
            <TouchableOpacity
              style={styles.coinSelector}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.coinSelectorText}>{selectedCoin}</Text>
            </TouchableOpacity>
          </View>
          {CoinsData && CoinsData.data.coins ? (
            <Text style={styles.calculatedValue}>
              {numeral(
                parseFloat(coinAmount) * 
                parseFloat(CoinsData.data.coins.find(coin => coin.symbol === selectedCoin)?.price || '0')
              ).format('$0,0.00')}
            </Text>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>

        {/* Coin List */}
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.coinListContainer}>
            {IsAllCoinsLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                nestedScrollEnabled={true}
                scrollEnabled={false}
                data={CoinsData.data.coins}
                keyExtractor={(item) => item.uuid}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </View>

      {/* Custom Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerHeaderText}>Select Coin</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CoinsData?.data.coins}
              renderItem={renderPickerItem}
              keyExtractor={(item) => item.uuid}
              style={styles.pickerList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  menuButton: {
    padding: 8,
  },
  coinListHeader: {
    backgroundColor: 'white',
    padding: 16,
  },
  coinListHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  calculatorCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calculatorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  calculatorInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
  },
  coinSelector: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  coinSelectorText: {
    fontSize: 16,
  },
  calculatedValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  coinListContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
  },
  coinItem: {
    width: '100%',
    paddingVertical: 16,
  },
  coinItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinSymbolContainer: {
    width: '16%',
  },
  coinSymbol: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinSymbolText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  coinInfo: {
    width: '55%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  coinName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinPrice: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  coinChange: {
    fontSize: 14,
  },
  positiveChange: {
    color: 'green',
  },
  negativeChange: {
    color: 'red',
  },
  coinMarketCap: {
    width: '29%',
    alignItems: 'flex-end',
  },
  marketCapText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickerList: {
    maxHeight: 300,
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerItemText: {
    fontSize: 16,
  },
});


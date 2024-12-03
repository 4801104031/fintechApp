import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

export default function CoinDetailsScreen() {
  const {params: {coinUuid}} = useRoute()
  return (
    <View>
      <Text>CoinDetailsScreen{coinUuid}</Text>
    </View>
  )
}
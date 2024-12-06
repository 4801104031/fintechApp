
import React from 'react'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../../tabs/home/HomeScreen'
import CoinDetailsScreen from '../../stacks/CoinDetailsScreen'
import SendToScreen from '../../tabs/home/SendToScreen'
import RequestScreen from '../../tabs/home/RequestScreen'
import TopUpScreen from '../../tabs/home/TopUpScreen'
import MoreOptionsScreen from '../../tabs/home/MoreOptionsScreen'

const Stack = createStackNavigator()

export default function HomeNavigation() {
  return (
    <Stack.Navigator
    screenOptions={
      {
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection:"horizontal",
      }
    }
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen}  />
  
      <Stack.Screen name="CoinDetails" component={CoinDetailsScreen} />
      <Stack.Screen name="SendTo" component={SendToScreen} />
      <Stack.Screen name="Requests" component={RequestScreen} />
      <Stack.Screen name="TopUp" component={TopUpScreen} />
      <Stack.Screen name="MoreOptions" component={MoreOptionsScreen} />
    
    
    </Stack.Navigator>
  )
}
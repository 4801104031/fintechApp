
import React from 'react'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import SearchScreen from '../../tabs/search/SearchScreen'

const Stack = createStackNavigator()

export default function SearchNavigation() {
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
      <Stack.Screen name="SearchScreen" component={SearchScreen}  />
    </Stack.Navigator>
  )
}
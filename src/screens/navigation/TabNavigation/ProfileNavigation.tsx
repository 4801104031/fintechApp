
import React from 'react'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../../tabs/profile/ProfileScreen'
import EditProfileScreen from '../../tabs/profile/EditProfileScreen'

const Stack = createStackNavigator()

export default function ProfileNavigation() {
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
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} 
       />
       <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Stack.Navigator>
  )
}
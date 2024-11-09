import React, { useState } from 'react'
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import TabNavigation from './TabNavigation';


const Stack = createStackNavigator();

export default function RootNavigation() {
  const [session, setSession] = useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: "horizontal"
        
      }}
      
      >
        
        
        {
          session ? (
            <Stack.Screen name = "TabNavigation" component={TabNavigation} />
          ) : (
            <Stack.Screen name = "AuthNavigation" component={AuthNavigation} />
          )
        }
      </Stack.Navigator>
     
    </NavigationContainer>


  )
}
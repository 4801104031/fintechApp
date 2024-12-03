import { View, Text, ActivityIndicator, Dimensions, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';
import Button from '@/src/components/Button';
import Breaker from '@/src/components/Breaker';
import ButtonOutline from '@/src/components/ButtonOutline';
import { AntDesign } from '@expo/vector-icons';
import {NavigationProp, useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';

const { width, height } = Dimensions.get("window")

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {navigate: navigateAuth}:NavigationProp<AuthNavigationType> = useNavigation()
  async function signUpWithEmail() {
    setIsLoading(true)
    const {
      data: {session},
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if(!session)
      Alert.alert("Đăng ký thành công. Hãy kiểm tra hộp thư để xác thực tài khoản!")

    if(error){
      setIsLoading(false)
    }
    else{
      setIsLoading(false)
    }
  }
  return (
    <View className="flex-1">
      {isLoading && (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center bg-black opacity-[0.45]" />

          <View className='absolute'>
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      )}

      <View className='justify-center items-center relative flex-1'>
        <View className='justify-center w-full px-4 space-y-4'
          style={{
            height: height * 0.75
          }}
        >
          {/* Welcome text */}
          <Animated.View
            className='justify-center items-center'
            entering={FadeInDown.duration(100).springify()}

          >
            <Text className='text-neutral-800 text-2xl leading-[60px]'
              style={{
                fontFamily: "PlusJakartaSansBold"
              }}>
              Đăng kí tài khoản

            </Text>

            <Text className='text-neutral-500 text-sm font-medium'>
              Welcome! Please enter your details.
            </Text>

          </Animated.View>
          {/* Text input */}
          <Animated.View
            className='py-8 space-y-8'
            entering={FadeInDown.duration(100).delay(200).springify()}

          >
            {/* Email */}
            <View className='border-2 border-gray-400 rounded-lg mb-8'>
              <TextInput
                className='p-4'
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder='Email'
                autoCapitalize='none'
              />


            </View>
            {/* password */}
            <View className='border-2 border-gray-400 rounded-lg'>
              <TextInput
                className='p-4'
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder='Password'
                autoCapitalize='none'
              />


            </View>


          </Animated.View>


          {/* Login Button */}
          <Animated.View className='w-full justify-start'
            entering={FadeInDown.duration(100).delay(300).springify()}>
            <View className='pb-6'>
              <Button title={"Đăng Kí"} action={() => signUpWithEmail()} />


            </View>

          </Animated.View>
          <View>
            <Breaker />
          </View>


          {/* 3rd Auth */}
          <View className='w-full justify-normal'>
            <Animated.View
              entering={FadeInDown.duration(100).delay(100).springify()}
              className=' pb-4'
            >
              <ButtonOutline title="Tiếp tục với Google">
                <AntDesign name='google' size={20} color="gray" />
              </ButtonOutline>

            </Animated.View>
          </View>

          {/* don't have account */}
          <Animated.View
            className='flex-row justify-center items-center'
            entering={FadeInDown.duration(100).delay(700).springify()}
          >
            <Text
              className='text-neutral-500 text-lg font-medium leading-[38px] text-center'
              style={{
                fontFamily: "PlusJakartaSansBold",
              }}>
              Đã có tài khoản?{" "}
            </Text>

            <Pressable onPress={() => navigateAuth("Login")}>
              <Text className='text-neutral-800 text-lg font-medium leading-[38px] text-center'
                style={{
                  fontFamily: "PlusJakartaSansBold",
                }}
              >
                Đăng nhập {" "}
              </Text>
            </Pressable>

          </Animated.View>


        </View>
      </View>




    </View>
  );
}

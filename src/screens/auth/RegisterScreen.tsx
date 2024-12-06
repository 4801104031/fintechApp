import { View, Text, ActivityIndicator, Dimensions, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';
import Button from '@/src/components/Button';
import {NavigationProp, useNavigation } from '@react-navigation/native';
import useSupabaseAuth from '@/hooks/useSupabaseAuth';

const { height } = Dimensions.get("window")

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {navigate: navigateAuth}:NavigationProp<AuthNavigationType> = useNavigation()
  const { signUpWithEmail } = useSupabaseAuth();

  async function handleSignUp() {
    setIsLoading(true);
    try {
      const { data, error } = await signUpWithEmail(email, password);
      if (error) throw error;

      Alert.alert(
        "Đăng ký thành công", 
        "Hãy kiểm tra hộp thư để xác thực tài khoản!"
      );
      navigateAuth("Login");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Lỗi đăng ký", error.message);
      } else {
        Alert.alert("Lỗi đăng ký", "Đã xảy ra lỗi không xác định");
      }
    } finally {
      setIsLoading(false);
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
          <Animated.View
            className='justify-center items-center'
            entering={FadeInDown.duration(100).springify()}
          >
            <Text className='text-neutral-800 text-2xl leading-[60px]'
              style={{
                fontFamily: "PlusJakartaSansBold"
              }}>
              Register Account
            </Text>
            <Text className='text-neutral-500 text-sm font-medium'>
              Welcome! Please enter your details.
            </Text>
          </Animated.View>

          <Animated.View
            className='py-8 space-y-8'
            entering={FadeInDown.duration(100).delay(200).springify()}
          >
            <View className='border-2 border-gray-400 rounded-lg mb-8'>
              <TextInput
                className='p-4'
                onChangeText={setEmail}
                value={email}
                placeholder='Email'
                autoCapitalize='none'
                keyboardType="email-address"
              />
            </View>
            <View className='border-2 border-gray-400 rounded-lg'>
              <TextInput
                className='p-4'
                onChangeText={setPassword}
                value={password}
                placeholder='Password'
                autoCapitalize='none'
                secureTextEntry
              />
            </View>
          </Animated.View>

          <Animated.View className='w-full justify-start'
            entering={FadeInDown.duration(100).delay(300).springify()}>
            <View className='pb-6'>
              <Button title="Sign up" action={handleSignUp} />
            </View>
          </Animated.View>

          <Animated.View
            className='flex-row justify-center items-center'
            entering={FadeInDown.duration(100).delay(700).springify()}
          >
            <Text
              className='text-neutral-500 text-lg font-medium leading-[38px] text-center'
              style={{
                fontFamily: "PlusJakartaSansBold",
              }}>
              Have an account?{" "}
            </Text>
            <Pressable onPress={() => navigateAuth("Login")}>
              <Text className='text-neutral-800 text-lg font-medium leading-[38px] text-center'
                style={{
                  fontFamily: "PlusJakartaSansBold",
                }}
              >
                Log in {" "}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
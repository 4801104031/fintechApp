import React, { useCallback, useState } from 'react';
import { View, Text, SafeAreaView, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, CameraIcon } from 'react-native-heroicons/outline';
import useSupabaseAuth from '@/hooks/useSupabaseAuth';
import { useUserStore } from '@/store/useUserStore';
import Avatar from '@/src/components/Avatar';

const EditProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const { getUserProfile, updateUserProfile } = useSupabaseAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [username, setUserName] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const { session } = useUserStore();
  const navigation = useNavigation();

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
        setFullname(data.full_name || '');
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
    }, [session])
  );

  const handleUploadAvatar = () => {
    // Logic for uploading an avatar
    console.log('Upload avatar clicked');
  };

  async function handleUpdateProfile() {
    if (!username || !fullname) {
      Alert.alert("Please fill in all fields!");
      return;
    }
  
    setLoading(true);
    try {
      const { error } = await updateUserProfile(
        username.trim(),
        fullname.trim(),
        avatarUrl || ''
      );
  
      if (error) {
        Alert.alert("Profile Update Failed", error.message);
      } else {
        Alert.alert("Profile Updated Successfully!");
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert("An unexpected error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="bg-white flex-1 px-4">
      {/* Header Section */}
      <View className="flex-row items-center mt-4">
        {/* Back Button */}
        <Pressable onPress={() => navigation.goBack()} className="absolute left-0">
          <View className="border-2 border-neutral-500 h-10 w-10 p-2 rounded-full items-center justify-center mt-5">
            <ChevronLeftIcon size={30} strokeWidth={3} color="gray" />
          </View>
        </Pressable>

        {/* Title */}
        <View className="flex-1 items-center mt-5">
          <Text className="text-xl font-bold">Edit Profile</Text>
        </View>
      </View>

      {/* Avatar Section */}
      <View className="mt-6 items-center">
        <View className="relative">
          <Avatar size={100} url={avatarUrl || ''} />
          <TouchableOpacity
            onPress={handleUploadAvatar}
            className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full"
          >
            <CameraIcon size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Section */}
      <View className="mt-6">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="border border-gray-300 rounded-lg p-4 mb-4"
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUserName}
          className="border border-gray-300 rounded-lg p-4 mb-4"
        />
        <TextInput
          placeholder="Fullname"
          value={fullname}
          onChangeText={setFullname}
          className="border border-gray-300 rounded-lg p-4 mb-4"
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity
        onPress={handleUpdateProfile}
        className="bg-green-500 p-4 rounded-lg items-center mt-4"
      >
        <Text className="text-white text-lg font-bold">Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  StyleSheet,
  View,
  Alert,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  size?: number;
  url: string | null;
  onUpload?: (filePath: string) => void;
  showUpLoad?: boolean;
}

const Avatar = ({ 
  url, 
  size = 150, 
  onUpload = () => {}, 
  showUpLoad = false 
}: Props) => {
  const [upLoading, setUpLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const avatarSize = { 
    height: size, 
    width: size,
    borderRadius: size / 4 
  };

  useEffect(() => {
    if (url) {
      downloadImage(url);
    }
  }, [url]);

  interface PublicUrlData {
    publicUrl: string;
  }
  
  const downloadImage = async (path: string) => {
    try {
      const { data } = await supabase.storage
        .from("avatar")
        .getPublicUrl(path) as { data: PublicUrlData };
    
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.log("Error downloading image: ", error);
      Alert.alert('Error', 'Could not download image');
    }
  };

  const uploadAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      setUpLoading(true);

      const photo = result.assets[0];
      const fileExt = photo.uri.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;

      // Chuyển đổi file thành Blob
      const response = await fetch(photo.uri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from('avatar')
        .upload(filePath, blob);

      if (error) throw error;

      // Gọi callback upload
      onUpload(filePath);

      // Tải và hiển thị ảnh mới
      if (data) {
        downloadImage(filePath);
      }

    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Upload Error', 'Could not upload image');
    } finally {
      setUpLoading(false);
    }
  };

  return (
    <View style={[avatarSize, styles.avatarContainer]}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View
          style={[
            avatarSize,
            styles.avatar,
            styles.noImage,
          ]}
        >
          <ActivityIndicator color="white" />
        </View>
      )}
      {showUpLoad && (
        <View style={styles.uploadIcon}>
          {!upLoading ? (
            <Pressable onPress={uploadAvatar}>
              <MaterialIcons name="cloud-upload" size={30} color="black" />
            </Pressable>
          ) : (
            <ActivityIndicator color="white" />
          )}
        </View>
      )}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatarContainer: {
    overflow: "hidden",
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
  noImage: {
    backgroundColor: "gray",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "rgb(200,200,200)",
    borderRadius: 20,
  },
  uploadIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  }
});
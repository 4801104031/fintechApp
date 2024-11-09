import { Text,Pressable } from 'react-native'
import React from 'react'

interface ButtonProps {
  title: any;
  action?: () => void
}

const Button: React.FC<ButtonProps> = ({ title, action }) => {
  return (
    <Pressable
      className="bg-blue-300 rounded-lg justify-center items-center py-3"
      onPress={action}
    >
      <Text className="text-white font-bold text-lg">{title}</Text>
    </Pressable>
  );
};

export default Button;
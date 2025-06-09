// src/components/inputs/CustomInput.tsx
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  ...props 
}) => {
  return (
    <TextInput
      className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 w-full max-w-xs mx-auto"
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  );
};

export default CustomInput;
import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: '#1F2937',
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
});

export default CustomInput;

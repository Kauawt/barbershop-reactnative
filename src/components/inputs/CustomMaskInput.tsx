import React from 'react';
import MaskInput, { MaskInputProps } from 'react-native-mask-input';
import { StyleSheet } from 'react-native';

const MASKS = {
  cpf: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
  date: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
  cep: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
  phone: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
} as const;

interface CustomMaskInputProps extends Omit<MaskInputProps, 'mask'> {
  placeholder: string;
  maskType?: keyof typeof MASKS;
  customMask?: (string | RegExp)[];
}

const CustomMaskInput: React.FC<CustomMaskInputProps> = ({
  placeholder,
  value,
  onChangeText,
  maskType,
  customMask,
  keyboardType,
  ...props
}) => {
  const mask = maskType ? [...MASKS[maskType]] : customMask;

  return (
    <MaskInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      mask={mask}
      keyboardType={keyboardType}
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
    marginBottom: 16, 
    color: '#1F2937',
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
});

export default CustomMaskInput;

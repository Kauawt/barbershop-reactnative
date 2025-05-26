// src/components/inputs/CustomMaskInput.tsx
import React from 'react';
import MaskInput, { MaskInputProps } from 'react-native-mask-input';

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
      className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 mb-4 text-gray-800 w-full max-w-xs mx-auto"
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

export default CustomMaskInput;
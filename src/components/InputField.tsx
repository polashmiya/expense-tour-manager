import React from 'react';
import { TextInput as PaperInput, HelperText } from 'react-native-paper';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  multiline?: boolean;
}

const InputField: React.FC<Props> = ({ label, value, onChangeText, error, ...rest }) => (
  <>
    <PaperInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={!!error}
      mode="outlined"
      {...rest}
    />
    {error && <HelperText type="error">{error}</HelperText>}
  </>
);

export default InputField;

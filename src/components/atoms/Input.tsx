import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../../theme';

interface InputProps extends TextInputProps {
  hasError?: boolean;
}

export const Input: React.FC<InputProps> = ({ style, hasError, ...props }) => {
  return (
    <TextInput
      style={[
        styles.input,
        hasError && styles.errorInput,
        style
      ]}
      placeholderTextColor={theme.colors.textSecondary}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    fontSize: theme.typography.size.m,
    color: theme.colors.text,
  },
  errorInput: {
    borderColor: theme.colors.error,
  },
});

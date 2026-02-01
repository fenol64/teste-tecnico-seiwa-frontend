import React from 'react';
import { View, StyleSheet, TextInputProps } from 'react-native';
import { Text } from '../atoms/Text';
import { Input } from '../atoms/Input';
import { theme } from '../../theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Input hasError={!!error} {...props} />
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.size.s,
    fontWeight: '600',
    color: theme.colors.text,
  },
  error: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.size.s,
    color: theme.colors.error,
  },
});

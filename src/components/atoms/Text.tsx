import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface TextProps {
  children: React.ReactNode;
  variant?: 'title' | 'body' | 'caption' | 'button';
  style?: TextStyle;
  color?: string;
}

export const Text: React.FC<TextProps> = ({ children, variant = 'body', style, color }) => {
  const getStyle = () => {
    switch (variant) {
      case 'title':
        return styles.title;
      case 'caption':
        return styles.caption;
      case 'button':
        return styles.button;
      default:
        return styles.body;
    }
  };

  return (
    <RNText style={[getStyle(), color && { color }, style]}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: theme.typography.size.m,
    color: theme.colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  button: {
    fontSize: theme.typography.size.s,
    fontWeight: theme.typography.weight.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { theme } from '../../theme';

interface RegisterFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    onSubmit({ name, email, password });
  };

  return (
    <View style={styles.container}>
      <FormField
        label="Nome"
        placeholder="Digite seu nome completo"
        value={name}
        onChangeText={setName}
      />
      <FormField
        label="E-mail"
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <FormField
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
       <FormField
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={error}
      />
      <Button
        label="Cadastrar"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.s,
  },
});

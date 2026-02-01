import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { RegisterForm } from '../components/organisms/RegisterForm';
import { Text } from '../components/atoms/Text';
import { theme } from '../theme';
import { authService } from '../services/auth.service';

interface Props {
  navigation: any;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data.name, data.email, data.password);
      console.log('Register successful:', response);
      if (Platform.OS === 'web') {
        window.alert('Sucesso\n\nConta criada com sucesso! Faça login.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.detail || 'Falha ao cadastrar. Tente novamente.';
      if (Platform.OS === 'web') {
        window.alert(`Erro\n\n${errorMessage}`);
      } else {
        Alert.alert('Erro', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

   const navigateToLogin = () => {
    navigation.goBack();
  };

  return (
    <AuthTemplate
      title="Criar Conta"
      footer={
         <View style={styles.footerContainer}>
          <Text variant="body">Já tem uma conta? </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text variant="button" style={styles.link}>Entrar</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
    </AuthTemplate>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: theme.colors.primary,
  },
});

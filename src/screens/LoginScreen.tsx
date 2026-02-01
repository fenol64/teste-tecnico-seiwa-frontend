import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { LoginForm } from '../components/organisms/LoginForm';
import { Text } from '../components/atoms/Text';
import { theme } from '../theme';
import { authService } from '../services/auth.service';
import { setAuthToken } from '../services/api';

// Mock navigation types for now
interface Props {
  navigation: any;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data.email, data.password);
      console.log('Login successful:', response);

      setAuthToken(response.access_token);

      // Navigate to Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard', params: { user: response.user } }],
      });

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 'Falha ao entrar. Tente novamente.';
      if (Platform.OS === 'web') {
        window.alert(`Erro\n\n${errorMessage}`);
      } else {
        Alert.alert('Erro', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <AuthTemplate
      title="Bem-vindo(a)"
      footer={
        <View style={styles.footerContainer}>
          <Text variant="body">Não tem uma conta? </Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text variant="button" style={styles.link}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
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

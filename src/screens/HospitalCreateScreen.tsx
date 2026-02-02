import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { hospitalsService } from '../services/hospitals.service';

export const HospitalCreateScreen: React.FC<any> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!address) newErrors.address = 'Endereço é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await hospitalsService.create({ name, address });

      if (Platform.OS === 'web') {
        window.alert('Hospital cadastrado com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Hospital cadastrado com sucesso!');
      }

      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Erro ao cadastrar hospital';
      if (Platform.OS === 'web') {
        window.alert(`Erro\n\n${msg}`);
      } else {
        Alert.alert('Erro', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button label="Voltar" variant="text" onPress={() => navigation.goBack()} />
        <Text variant="title">Novo Hospital</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContent}>
        <FormField
          label="Nome do Hospital"
          placeholder="Ex: Hospital Central"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <FormField
          label="Endereço"
          placeholder="Ex: Av. Paulista, 1000 - São Paulo"
          value={address}
          onChangeText={setAddress}
          error={errors.address}
          multiline
          numberOfLines={3}
          style={{ height: 100 }}
        />

        <View style={styles.footer}>
          <Button
            label={loading ? "Salvando..." : "Cadastrar Hospital"}
            onPress={handleCreate}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  formContent: {
    padding: theme.spacing.m,
  },
  footer: {
    marginTop: theme.spacing.l,
  },
});

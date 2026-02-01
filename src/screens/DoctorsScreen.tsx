import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { doctorsService, Doctor } from '../services/doctors.service';

export const DoctorsScreen: React.FC<any> = ({ navigation }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsService.getAll();
      setDoctors(response.items);
    } catch (error) {
       if (Platform.OS === 'web') {
        window.alert('Falha ao buscar médicos');
       } else {
        Alert.alert('Erro', 'Falha ao buscar médicos');
       }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const renderItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity style={styles.itemCard} onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}>
      <View style={styles.row}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.info}>
            <Text variant="body" style={styles.name}>{item.name}</Text>
            <Text variant="caption">{item.specialty} • CRM: {item.crm}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
        <Text variant="title">Médicos</Text>
        <Button label="Novo" onPress={() => console.log('Add Doctor')} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum médico encontrado.</Text>}
        />
      )}
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
  list: {
    padding: theme.spacing.m,
  },
  itemCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
  },
  avatarText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  info: {
      flex: 1,
  },
  name: {
      fontWeight: '600',
  },
  empty: {
      textAlign: 'center',
      marginTop: theme.spacing.xl,
      color: theme.colors.textSecondary,
  }
});

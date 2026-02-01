import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { hospitalsService, Hospital } from '../services/hospitals.service';

export const HospitalsScreen: React.FC<any> = ({ navigation }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await hospitalsService.getAll();
      setHospitals(res.items);
    } catch (e) {
      if(Platform.OS === 'web') window.alert('Erro ao carregar hospitais');
      else Alert.alert('Erro', 'Falha ao buscar hospitais');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
        <Text variant="title">Hospitais</Text>
        <Button label="Novo" onPress={() => console.log('Add Hospital')} />
      </View>
      {loading ? <ActivityIndicator style={{marginTop: 20}} /> : (
        <FlatList
          data={hospitals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('HospitalDetail', { hospitalId: item.id })}>
              <Text style={styles.name}>{item.name}</Text>
              <Text variant="caption">{item.address}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
  },
  list: { padding: theme.spacing.m },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
  },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
});

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { productionsService, Production } from '../services/productions.service';
import { doctorsService } from '../services/doctors.service';
import { hospitalsService } from '../services/hospitals.service';

export const ProductionsScreen: React.FC<any> = ({ navigation }) => {
  const [data, setData] = useState<Production[]>([]);
  const [doctors, setDoctors] = useState<Record<string, string>>({});
  const [hospitals, setHospitals] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, docRes, hospRes] = await Promise.all([
        productionsService.getAll(),
        doctorsService.getAll(1, 100), // Get more to cover list
        hospitalsService.getAll(1, 100)
      ]);

      setData(prodRes.items);

      const docMap: Record<string, string> = {};
      docRes.items.forEach(d => docMap[d.id] = d.name);
      setDoctors(docMap);

      const hospMap: Record<string, string> = {};
      hospRes.items.forEach(h => hospMap[h.id] = h.name);
      setHospitals(hospMap);

    } catch (e) {
      if(Platform.OS === 'web') window.alert('Erro ao carregar produções');
      else Alert.alert('Erro', 'Falha ao buscar produções');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
        <Text variant="title">Produções</Text>
        <Button label="Nova" onPress={() => console.log('Add Production')} />
      </View>
      {loading ? <ActivityIndicator style={{marginTop: 20}} /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.typeBadge}>{item.type.toUpperCase()}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              {item.description && <Text style={styles.desc}>{item.description}</Text>}
              <Text variant="caption">
                Méd: {doctors[item.doctor_id] || 'Desconhecido'}
                {'\n'}
                Hosp: {hospitals[item.hospital_id] || 'Desconhecido'}
              </Text>
            </View>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeBadge: {
      fontWeight: 'bold',
      color: "#fff",
      backgroundColor: theme.colors.primary + '10',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4
  },
  date: { color: theme.colors.textSecondary },
  desc: { marginBottom: 8 },
});

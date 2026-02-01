import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { repassesService, Repasse } from '../services/repasses.service';
import { productionsService } from '../services/productions.service';

export const RepassesScreen: React.FC<any> = ({ navigation }) => {
  const [data, setData] = useState<Repasse[]>([]);
  const [productions, setProductions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [repRes, prodRes] = await Promise.all([
        repassesService.getAll(),
        productionsService.getAll(1, 100) // Fetch enough productions for mapping
      ]);

      setData(repRes.items);

      const prodMap: Record<string, string> = {};
      prodRes.items.forEach(p => {
        prodMap[p.id] = `${p.type.toUpperCase()} - ${new Date(p.date).toLocaleDateString()}`;
      });
      setProductions(prodMap);

    } catch (e) {
      if(Platform.OS === 'web') window.alert('Erro ao carregar repasses');
      else Alert.alert('Error', 'Falha ao buscar repasses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
        <Text variant="title">Repasses</Text>
        <Button label="Novo" onPress={() => console.log('Add Repasse')} />
      </View>
      {loading ? <ActivityIndicator style={{marginTop: 20}} /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RepasseDetail', { repasseId: item.id })}>
              <View style={styles.row}>
                <Text style={styles.amount}>R$ {item.valor}</Text>
                <Text style={[styles.status, { color: item.status === 'consolidado' ? 'green' : 'orange' }]}>
                    {item.status.toUpperCase()}
                </Text>
              </View>
              <Text variant="caption">
                Produção: {productions[item.production_id] || 'Desconhecido'}
              </Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  amount: { fontWeight: 'bold', fontSize: 18 },
  status: { fontWeight: '600', fontSize: 12 },
});

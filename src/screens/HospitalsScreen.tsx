import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { hospitalsService, Hospital } from '../services/hospitals.service';

export const HospitalsScreen: React.FC<any> = ({ navigation }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData(1);
  }, []);

  const loadData = async (pageToLoad = 1) => {
    try {
      if (pageToLoad === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await hospitalsService.getAll(pageToLoad);

      if (pageToLoad === 1) {
        setHospitals(res.items);
      } else {
        setHospitals(prev => [...prev, ...res.items]);
      }

      setTotalPages(res.total_pages);
      setPage(pageToLoad);
    } catch (e) {
      if(Platform.OS === 'web') window.alert('Erro ao carregar hospitais');
      else Alert.alert('Erro', 'Falha ao buscar hospitais');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      loadData(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
        <Text variant="title">Hospitais</Text>
        <Button label="Novo" onPress={() => navigation.navigate('HospitalCreate')} />
      </View>
      {loading ? <ActivityIndicator style={{marginTop: 20}} /> : (
        <FlatList
          data={hospitals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('HospitalDetail', { hospitalId: item.id })}>
              <View style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text variant="caption">{item.address}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
});

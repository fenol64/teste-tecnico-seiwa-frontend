import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { doctorsService, Doctor } from '../services/doctors.service';
import { productionsService, Production } from '../services/productions.service';
import { repassesService, RepasseStats } from '../services/repasses.service';

export const DoctorDetailScreen = ({ route, navigation }: any) => {
    const { doctorId } = route.params;
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [productions, setProductions] = useState<Production[]>([]);
    const [stats, setStats] = useState<RepasseStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [doctorId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [docRes, prodRes, statsRes] = await Promise.all([
                doctorsService.getById(doctorId),
                productionsService.getByDoctor(doctorId),
                repassesService.getStats(doctorId)
            ]);

            setDoctor(docRes);
            setProductions(prodRes);
            setStats(statsRes);

        } catch (error) {
            console.error(error);
            const msg = 'Falha ao carregar detalhes do médico';
             if (Platform.OS === 'web') window.alert(msg);
             else Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    if (!doctor) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
                <Text variant="title">Perfil do Médico</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Doctor Info */}
                <View style={styles.card}>
                    <Text variant="title">{doctor.name}</Text>
                    <Text variant="body">CRM: {doctor.crm}</Text>
                    <Text variant="caption">{doctor.specialty}</Text>
                    <Text variant="caption">{doctor.email}</Text>
                </View>

                {/* Stats */}
                {stats && (
                    <View style={styles.statsContainer}>
                        <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
                            <Text variant="caption">Pendente</Text>
                            <Text variant="title" style={{ color: '#1565c0' }}>{stats.total_pendente_qtd}</Text>
                            <Text variant="body">R$ {stats.total_pendente_valor}</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
                             <Text variant="caption">Consolidado</Text>
                            <Text variant="title" style={{ color: '#2e7d32' }}>{stats.total_consolidado_qtd}</Text>
                            <Text variant="body">R$ {stats.total_consolidado_valor}</Text>
                        </View>
                    </View>
                )}

                {/* Productions List */}
                <Text variant="title" style={styles.sectionTitle}>Produções Recentes</Text>
                {productions.length === 0 ? (
                    <Text variant="body" style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma produção encontrada.</Text>
                ) : (
                    productions.map((item) => (
                        <View key={item.id} style={styles.productionItem}>
                            <View>
                                <Text variant="body" style={{ fontWeight: 'bold' }}>{item.type.toUpperCase()}</Text>
                                <Text variant="caption">{new Date(item.date).toLocaleDateString()}</Text>
                            </View>
                            {/* You could add functionality here to go to specific production detail if it existed */}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
    content: { padding: 16 },
    card: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: { flex: 0.48, padding: 16, borderRadius: 8, alignItems: 'center' },
    sectionTitle: { marginBottom: 10, marginTop: 10 },
    productionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' }
});

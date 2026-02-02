import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { hospitalsService, Hospital } from '../services/hospitals.service';
import { productionsService, Production } from '../services/productions.service';
import { repassesService, Repasse } from '../services/repasses.service';
import { doctorsService, Doctor } from '../services/doctors.service';

export const HospitalDetailScreen = ({ route, navigation }: any) => {
    const { hospitalId } = route.params;
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [productions, setProductions] = useState<Production[]>([]);
    const [repasses, setRepasses] = useState<Repasse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [hospitalId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [hospRes, docsRes, prodsData, repassesData] = await Promise.all([
                hospitalsService.getById(hospitalId),
                hospitalsService.getDoctors(hospitalId),
                productionsService.getByHospital(hospitalId),
                repassesService.getByHospital(hospitalId)
            ]);
            console.log('Hospital details loaded:', hospRes, docsRes);
            setHospital(hospRes);
            setDoctors(docsRes);
            setProductions(prodsData);
            setRepasses(repassesData);
        } catch (error) {
             console.error(error);
             const msg = 'Falha ao carregar detalhes do hospital';
             if (Platform.OS === 'web') window.alert(msg);
             else Alert.alert('Erro', msg);
        } finally {
            setLoading(false);
        }
    };

    // Calculations
    let shiftCount = 0;
    let consultationCount = 0;
    const consolidatedRepasses = [];
    const pendingRepasses = [];

    for (const prod of productions) {
        const type = prod.type?.toLowerCase();
        if (type === 'shift' || type === 'plantao') shiftCount++;
        else if (type === 'consultation' || type === 'consulta') consultationCount++;
    }
    for (const rep of repasses) {
        const status = rep.status?.toLowerCase();
        if (status === 'consolidated' || status === 'consolidado') consolidatedRepasses.push(rep);
        else if (status === 'pending' || status === 'pendente') pendingRepasses.push(rep);
    }
    const totalConsolidatedValue = consolidatedRepasses.reduce((acc, curr) => acc + Number(curr.amount || curr.valor || 0), 0);
    const totalPendingValue = pendingRepasses.reduce((acc, curr) => acc + Number(curr.amount || curr.valor || 0), 0);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    if (!hospital) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
                <Text variant="title">Perfil do Hospital</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Hospital Info */}
                <View style={styles.card}>
                    <Text variant="title">{hospital.name}</Text>
                    <Text variant="body">{hospital.address}</Text>
                </View>

                 {/* Financial Summary */}
                <Text variant="title" style={styles.sectionTitle}>Financeiro</Text>
                <View style={[styles.statsRow, { marginBottom: 20 }]}>
                    <View style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
                        <Text variant="caption">Consolidado</Text>
                        <Text variant="title" style={{ color: '#2e7d32' }}>R$ {totalConsolidatedValue.toFixed(2)}</Text>
                        <Text variant="caption">{consolidatedRepasses.length} repasses</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#e3f2fd' }]}>
                        <Text variant="caption">Pendente</Text>
                        <Text variant="title" style={{ color: '#1565c0' }}>R$ {totalPendingValue.toFixed(2)}</Text>
                        <Text variant="caption">{pendingRepasses.length} repasses</Text>
                    </View>
                </View>

                {/* Production Stats */}
                <Text variant="title" style={styles.sectionTitle}>Resumo de Produção</Text>
                <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
                    <View style={{alignItems: 'center'}}>
                        <Text variant="body">Total</Text>
                        <Text variant="title">{productions.length}</Text>
                    </View>
                    <View style={{width: 1, height: 40, backgroundColor: '#eee'}} />
                    <View style={{alignItems: 'center'}}>
                        <Text variant="body">Plantões</Text>
                        <Text variant="body" style={{fontWeight: 'bold'}}>{shiftCount}</Text>
                    </View>
                     <View style={{width: 1, height: 40, backgroundColor: '#eee'}} />
                    <View style={{alignItems: 'center'}}>
                        <Text variant="body">Consultas</Text>
                        <Text variant="body" style={{fontWeight: 'bold'}}>{consultationCount}</Text>
                    </View>
                </View>

                {/* Doctors List */}
                <Text variant="title" style={styles.sectionTitle}>Médicos ({doctors?.length})</Text>
                {doctors?.length === 0 ? (
                    <Text variant="caption">Nenhum médico encontrado.</Text>
                ) : (
                    doctors.map(doc => (
                        <TouchableOpacity key={doc.id} style={styles.itemRow} onPress={() => navigation.navigate('DoctorDetail', { doctorId: doc.id })}>
                             <Text variant="body" style={{fontWeight: 'bold'}}>{doc.name}</Text>
                             <Text variant="caption">{doc.specialty}</Text>
                        </TouchableOpacity>
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
    itemRow: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { marginBottom: 10, marginTop: 10, fontSize: 18, fontWeight: 'bold' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
    statCard: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
});

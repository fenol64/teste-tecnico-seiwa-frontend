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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [hospitalId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [hospRes, docsRes] = await Promise.all([
                hospitalsService.getById(hospitalId),
                hospitalsService.getDoctors(hospitalId)
            ]);
            console.log('Hospital details loaded:', hospRes, docsRes);
            setHospital(hospRes);
            setDoctors(docsRes);
        } catch (error) {
             console.error(error);
             const msg = 'Falha ao carregar detalhes do hospital';
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
});

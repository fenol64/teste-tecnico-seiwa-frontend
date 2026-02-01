import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { repassesService } from '../services/repasses.service';
import { productionsService } from '../services/productions.service';
import { doctorsService } from '../services/doctors.service';
import { hospitalsService } from '../services/hospitals.service';
import { theme } from '../theme';

export const RepasseDetailScreen = ({ route, navigation }: any) => {
    const { repasseId } = route.params;
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        loadDetails();
    }, [repasseId]);

    const loadDetails = async () => {
        try {
            setLoading(true);
            // 1. Get Repasse
            const repasse = await repassesService.getById(repasseId);

            // 2. Get Production
            const production = await productionsService.getById(repasse.production_id);

            // 3. Get Doctor and Hospital associated with the production
            const [doctor, hospital] = await Promise.all([
                doctorsService.getById(production.doctor_id),
                hospitalsService.getById(production.hospital_id)
            ]);

            setDetails({
                repasse,
                production,
                doctor,
                hospital
            });

        } catch (error) {
             console.error(error);
             const msg = 'Falha ao carregar detalhes';
             if (Platform.OS === 'web') window.alert(msg);
             else Alert.alert('Erro', msg);
             navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color={theme.colors.primary} /></SafeAreaView>;
    if (!details) return null;

    const repAmount = details.repasse.amount || details.repasse.valor;
    const isConsolidated = details.repasse.status?.toLowerCase() === 'consolidated' || details.repasse.status?.toLowerCase() === 'consolidado';

    return (
        <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
                <Text variant="title">Detalhes do Repasse</Text>
                <View style={{width: 50}} />
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text variant="body" style={styles.label}>Médico</Text>
                    <Text variant="title">{details.doctor.name}</Text>
                    <Text variant="caption">CRM: {details.doctor.crm}</Text>
                    <Text variant="caption">{details.doctor.specialty}</Text>
                </View>

                <View style={styles.section}>
                    <Text variant="body" style={styles.label}>Hospital</Text>
                    <Text variant="title">{details.hospital.name}</Text>
                    <Text variant="caption">{details.hospital.address}</Text>
                </View>

                <View style={styles.section}>
                    <Text variant="body" style={styles.label}>Produção</Text>
                    <Text variant="body">{details.production.type.toUpperCase()}</Text>
                     <Text variant="caption">{new Date(details.production.date).toLocaleDateString()}</Text>
                </View>

                 <View style={styles.section}>
                    <Text variant="body" style={styles.label}>Informações do Repasse</Text>
                    <Text variant="title" style={{color: theme.colors.primary}}>R$ {repAmount}</Text>
                    <Text variant="body" style={{ color: isConsolidated ? 'green' : 'orange', fontWeight: 'bold', marginTop: 8 }}>
                        {details.repasse.status.toUpperCase()}
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
    content: { padding: 16 },
    section: { marginBottom: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
    label: { color: '#666', marginBottom: 6, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }
});

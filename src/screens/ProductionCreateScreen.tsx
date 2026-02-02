import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { SelectField } from '../components/molecules/SelectField';
import { productionsService } from '../services/productions.service';
import { doctorsService } from '../services/doctors.service';
import { hospitalsService } from '../services/hospitals.service';

const PRODUCTION_TYPES = [
  { id: 'shift', name: 'Plantão' },
  { id: 'consultation', name: 'Consulta' },
];

export const ProductionCreateScreen: React.FC<any> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  // Data Lists
  const [doctors, setDoctors] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);

  // Form State
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default today YYYY-MM-DD
  const [description, setDescription] = useState('');
  
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [docsRes, hospsRes] = await Promise.all([
        doctorsService.getAll(1, 100), // Get first 100 doctors
        hospitalsService.getAll(1, 100) // Get first 100 hospitals
      ]);
      setDoctors(docsRes.items);
      setHospitals(hospsRes.items);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao carregar dados iniciais');
    } finally {
      setFetchingData(false);
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!doctorId) newErrors.doctor = 'Médico é obrigatório';
    if (!hospitalId) newErrors.hospital = 'Hospital é obrigatório';
    if (!type) newErrors.type = 'Tipo é obrigatório';
    if (!date) newErrors.date = 'Data é obrigatória';
    // Validate Date format YYYY-MM-DD regex
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        newErrors.date = 'Formato inválido (AAAA-MM-DD)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await productionsService.create({
        doctor_id: doctorId!,
        hospital_id: hospitalId!,
        type: type as 'shift' | 'consultation',
        date,
        description
      });
      
      if (Platform.OS === 'web') {
        window.alert('Produção cadastrada com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Produção cadastrada com sucesso!');
      }
      
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Erro ao cadastrar produção';
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
        <Text variant="title">Nova Produção</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContent}>
        
        <SelectField
            label="Médico"
            items={doctors}
            value={doctorId}
            onSelect={(item) => setDoctorId(item.id)}
            loading={fetchingData}
            error={errors.doctor}
            placeholder="Selecione o médico"
        />

        <SelectField
            label="Hospital"
            items={hospitals}
            value={hospitalId}
            onSelect={(item) => setHospitalId(item.id)}
            loading={fetchingData}
            error={errors.hospital}
            placeholder="Selecione o hospital"
        />

        <SelectField
            label="Tipo"
            items={PRODUCTION_TYPES}
            value={type}
            onSelect={(item) => setType(item.id)}
            error={errors.type}
            placeholder="Selecione o tipo"
        />

        <FormField
          label="Data (AAAA-MM-DD)"
          placeholder="Ex: 2026-02-01"
          value={date}
          onChangeText={setDate}
          error={errors.date}
          keyboardType="numeric"
        />

        <FormField
          label="Observações (Opcional)"
          placeholder="Ex: Plantão extra noturno"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ height: 100 }}
        />

        <View style={styles.footer}>
          <Button 
            label={loading ? "Salvando..." : "Registrar Produção"} 
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
    marginBottom: theme.spacing.xl, 
  },
});

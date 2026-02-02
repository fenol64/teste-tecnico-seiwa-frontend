import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { doctorsService } from '../services/doctors.service';
import { hospitalsService, Hospital } from '../services/hospitals.service';

export const DoctorCreateScreen: React.FC<any> = ({ navigation }) => {
  const [step, setStep] = useState<'create' | 'assign'>('create');
  const [loading, setLoading] = useState(false);
  const [createdDoctorId, setCreatedDoctorId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [crm, setCrm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<any>({});

  // Hospital State
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);

  useEffect(() => {
    if (step === 'assign') {
      fetchHospitals();
    }
  }, [step]);

  const fetchHospitals = async () => {
    try {
      setHospitalLoading(true);
      const response = await hospitalsService.getAll(1, 100); // Fetch enough hospitals
      setHospitals(response.items);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao buscar hospitais');
    } finally {
      setHospitalLoading(false);
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!crm) newErrors.crm = 'CRM é obrigatório';
    if (!specialty) newErrors.specialty = 'Especialidade é obrigatória';
    if (!email) newErrors.email = 'Email é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const data = {
        name,
        crm,
        specialty,
        phone: phone || undefined,
        email,
      };

      const newDoctor = await doctorsService.create(data);
      setCreatedDoctorId(newDoctor.id);

      if (Platform.OS === 'web') {
        window.alert('Médico cadastrado com sucesso! Agora você pode vinculá-lo a hospitais.');
      } else {
        Alert.alert('Sucesso', 'Médico cadastrado com sucesso! Agora você pode vinculá-lo a hospitais.');
      }

      setStep('assign');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Erro ao cadastrar médico';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleHospital = (id: string) => {
    if (selectedHospitals.includes(id)) {
      setSelectedHospitals(selectedHospitals.filter(hId => hId !== id));
    } else {
      setSelectedHospitals([...selectedHospitals, id]);
    }
  };

  const handleAssign = async () => {
    if (!createdDoctorId) return;
    if (selectedHospitals.length === 0) {
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);
      // Assign sequentially
      for (const hospitalId of selectedHospitals) {
        await doctorsService.assignHospital(createdDoctorId, hospitalId);
      }

      if (Platform.OS === 'web') {
        window.alert('Vínculos criados com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Vínculos criados com sucesso!');
      }
      navigation.goBack();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao vincular com alguns hospitais');
    } finally {
      setLoading(false);
    }
  };

  const renderCreateStep = () => (
    <ScrollView contentContainerStyle={styles.formContent}>
      <FormField
        label="Nome Completo"
        placeholder="Ex: Dr. João Silva"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />
      <FormField
        label="CRM"
        placeholder="Ex: 12345/SP"
        value={crm}
        onChangeText={setCrm}
        error={errors.crm}
      />
      <FormField
        label="Especialidade"
        placeholder="Ex: Cardiologia"
        value={specialty}
        onChangeText={setSpecialty}
        error={errors.specialty}
      />
      <FormField
        label="Email"
        placeholder="doctor@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <FormField
        label="Telefone (Opcional)"
        placeholder="(11) 99999-9999"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <View style={styles.footer}>
        <Button
          label={loading ? "Salvando..." : "Cadastrar e Vincular Hospitais"}
          onPress={handleCreate}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );

  const renderAssignStep = () => (
    <View style={styles.assignContainer}>
      <Text style={styles.subtitle}>Selecione os hospitais onde o médico atua:</Text>

      {hospitalLoading ? (
         <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={hospitals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isSelected = selectedHospitals.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.hospitalItem, isSelected && styles.hospitalItemSelected]}
                onPress={() => toggleHospital(item.id)}
              >
                <View>
                  <Text style={[styles.hospitalName, isSelected && styles.hospitalNameSelected]}>
                    {item.name}
                  </Text>
                  <Text variant="caption" style={isSelected && styles.hospitalNameSelected}>
                    {item.address}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Text style={{color: 'white'}}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={styles.footer}>
        <Button
          label={loading ? "Salvando..." : `Concluir (${selectedHospitals.length})`}
          onPress={handleAssign}
          disabled={loading}
        />
        <Button
          label="Pular esta etapa"
          variant="text"
          onPress={() => navigation.goBack()}
          style={{ marginTop: theme.spacing.s }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button label="Voltar" variant="text" onPress={() => navigation.goBack()} />
        <Text variant="title">Novo Médico</Text>
        <View style={{ width: 50 }} />
      </View>

      {step === 'create' ? renderCreateStep() : renderAssignStep()}
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
  assignContainer: {
    flex: 1,
    padding: theme.spacing.m,
  },
  subtitle: {
    marginBottom: theme.spacing.m,
    fontSize: theme.typography.size.m,
    color: theme.colors.textSecondary,
  },
  list: {
    paddingBottom: theme.spacing.l * 2,
  },
  footer: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  hospitalItem: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hospitalItemSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  hospitalName: {
    fontSize: theme.typography.size.m,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  hospitalNameSelected: {
    color: 'white',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

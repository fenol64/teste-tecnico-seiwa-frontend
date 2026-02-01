import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Text } from '../components/atoms/Text';
import { Button } from '../components/atoms/Button';

interface DashboardScreenProps {
  navigation: any;
  route: any; // To get params like user name
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation, route }) => {
  const userName = route.params?.user?.name || 'Usuário';

  const menuItems = [
    { title: 'Médicos', route: 'Doctors', icon: '🩺', description: 'Gerenciar equipe médica' },
    { title: 'Hospitais', route: 'Hospitals', icon: '🏥', description: 'Gerenciar hospitais' },
    { title: 'Produções', route: 'Productions', icon: '📋', description: 'Acompanhar produções' },
    { title: 'Repasses', route: 'Repasses', icon: '💰', description: 'Registros financeiros' },
  ];

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
            <Text variant="title">Olá, {userName}</Text>
            <Text variant="caption">Bem-vindo ao seu painel</Text>
        </View>
        <Button label="Sair" onPress={handleLogout} variant="outline" style={styles.logoutButton} />
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.card}
            onPress={() => navigation.navigate(item.route)}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text variant="body" style={styles.cardTitle}>{item.title}</Text>
            <Text variant="caption" style={styles.cardDesc}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.m,
  },
  logoutButton: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    marginBottom: theme.spacing.l,
    alignItems: 'center',
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 50,
    overflow: 'hidden',
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  cardDesc: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});

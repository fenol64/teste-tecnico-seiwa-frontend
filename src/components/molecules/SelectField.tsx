import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Text } from '../atoms/Text';
import { theme } from '../../theme';

interface Item {
  id: string;
  name: string;
  [key: string]: any;
}

interface SelectFieldProps {
  label: string;
  placeholder?: string;
  value: string | null;
  items: Item[];
  onSelect: (item: Item) => void;
  error?: string;
  loading?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({ 
  label, 
  placeholder = "Selecione...", 
  value, 
  items, 
  onSelect, 
  error,
  loading 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedItem = items.find(i => i.id === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={[styles.input, error && styles.errorInput]} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.text, !selectedItem && styles.placeholder]}>
          {selectedItem ? selectedItem.name : placeholder}
        </Text>
        <Text variant="caption">▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text variant="title" style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                   <Text style={{fontSize: 24}}>×</Text>
                </TouchableOpacity>
              </View>
              
              {loading ? (
                 <Text style={{padding: 20, textAlign: 'center'}}>Carregando...</Text>
              ) : items.length === 0 ? (
                 <Text style={{padding: 20, textAlign: 'center'}}>Nenhum item encontrado.</Text>
              ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                    renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.item}
                        onPress={() => {
                            onSelect(item);
                            setModalVisible(false);
                        }}
                    >
                        <Text style={[styles.itemText, item.id === value && styles.selectedText]}>
                            {item.name}
                        </Text>
                        {item.id === value && <Text style={styles.check}>✓</Text>}
                    </TouchableOpacity>
                    )}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.size.s,
    fontWeight: '600',
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorInput: {
    borderColor: theme.colors.error,
  },
  text: {
     fontSize: theme.typography.size.m,
     color: theme.colors.text,
  },
  placeholder: {
      color: theme.colors.textSecondary,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.size.xs,
    marginTop: theme.spacing.xs,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    maxHeight: '80%',
    padding: theme.spacing.m,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: theme.spacing.s,
  },
  modalTitle: {
      fontSize: 18,
  },
  list: {
      
  },
  item: {
      paddingVertical: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '40', // lighter border
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  itemText: {
      fontSize: 16,
      color: theme.colors.text,
  },
  selectedText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
  },
  check: {
      color: theme.colors.primary,
      fontWeight: 'bold',
  }

});

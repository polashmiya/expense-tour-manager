import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTransactionContext } from '../../../context/TransactionContext';
import InputField from '../../../components/InputField';

const AddGroupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addGroup } = useTransactionContext();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a group name');
      return;
    }
    addGroup({ id: Date.now().toString(), name });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Group</Text>
      <InputField label="Group Name" value={name} onChangeText={setName} error={error} />
      <Button mode="contained" onPress={handleSave} style={{ marginTop: 16 }}>Save</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
});

export default AddGroupScreen;

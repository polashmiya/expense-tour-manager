import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTransactionContext } from '../../../context/TransactionContext';
import InputField from '../../../components/InputField';

const EditGroupScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { groups, editGroup } = useTransactionContext();
  const group = groups.find(g => g.id === groupId);
  const [name, setName] = useState(group?.name || '');
  const [error, setError] = useState('');

  if (!group) return <Text>Group not found</Text>;

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a group name');
      return;
    }
    editGroup({ ...group, name });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Group</Text>
      <InputField label="Group Name" value={name} onChangeText={setName} error={error} />
      <Button mode="contained" onPress={handleSave} style={styles.saveBtn}>Save</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
  saveBtn: { marginTop: 16 },
});

export default EditGroupScreen;

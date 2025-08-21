import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactionContext } from '../../../context/TransactionContext';
import { TransactionType } from '../../../types';
import InputField from '../../../components/InputField';

const AddTransactionScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { isGroup, groupId } = route.params || {};
  const { addTransaction, groups } = useTransactionContext();
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim() || !amount || isNaN(Number(amount))) {
      setError('Please enter valid title and amount');
      return;
    }
    addTransaction({
      id: Date.now().toString(),
      type,
      title,
      amount: Number(amount),
      date: date.toISOString(),
      groupId: isGroup ? groupId : undefined,
      description: description.trim() ? description : undefined,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isGroup ? 'Add Group Transaction' : 'Add Personal Transaction'}</Text>
      {isGroup && (
        <View style={styles.groupNameContainer}>
          <Text style={styles.groupLabel}>Group</Text>
          <Text style={styles.groupName}>{groups.find(g => g.id === groupId)?.name || ''}</Text>
        </View>
      )}
      <View style={styles.row}>
        <Button mode={type === 'income' ? 'contained' : 'outlined'} onPress={() => setType('income')} style={styles.typeBtn}>Income</Button>
        <Button mode={type === 'expense' ? 'contained' : 'outlined'} onPress={() => setType('expense')} style={styles.typeBtn}>Expense</Button>
      </View>
      <View style={styles.inputGap}><InputField label="Title" value={title} onChangeText={setTitle} error={error && !title ? error : ''} /></View>
      <View style={styles.inputGap}><InputField label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" error={error && (!amount || isNaN(Number(amount))) ? error : ''} /></View>
      <View style={styles.inputGap}><InputField
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      /></View>
  <Button buttonColor="#1976d2" textColor="#fff" onPress={() => setShowDate(true)} style={styles.dateBtn}>Pick Date: {date.toLocaleDateString()}</Button>
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDate(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
  <Button mode="contained" buttonColor="#1976d2" onPress={handleSave} style={styles.saveBtn}>Save</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
  groupNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  groupLabel: {
    fontWeight: 'bold',
    color: '#1976d2',
    fontSize: 15,
    marginRight: 8,
  },
  groupName: {
    fontWeight: 'bold',
    color: '#1565c0',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', marginBottom: 8 },
  typeBtn: { flex: 1, marginHorizontal: 4 },
  inputGap: { marginBottom: 14 },
  dateBtn: { marginVertical: 8 },
  saveBtn: { marginTop: 16 },
});

export default AddTransactionScreen;

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import InputField from '../components/InputField';
import { useTransactionContext } from '../context/TransactionContext';
import { TransactionType } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddTransactionScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { isGroup, groupId } = route.params || {};
  const { addTransaction, groups } = useTransactionContext();
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
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
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isGroup ? 'Add Group Transaction' : 'Add Personal Transaction'}</Text>
      {isGroup && <Text>Group: {groups.find(g => g.id === groupId)?.name || ''}</Text>}
      <View style={styles.row}>
        <Button mode={type === 'income' ? 'contained' : 'outlined'} onPress={() => setType('income')} style={styles.typeBtn}>Income</Button>
        <Button mode={type === 'expense' ? 'contained' : 'outlined'} onPress={() => setType('expense')} style={styles.typeBtn}>Expense</Button>
      </View>
      <InputField label="Title" value={title} onChangeText={setTitle} error={error && !title ? error : ''} />
      <InputField label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" error={error && (!amount || isNaN(Number(amount))) ? error : ''} />
      <Button onPress={() => setShowDate(true)} style={{ marginVertical: 8 }}>Pick Date: {date.toLocaleDateString()}</Button>
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
      <Button mode="contained" onPress={handleSave} style={{ marginTop: 16 }}>Save</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 8 },
  typeBtn: { flex: 1, marginHorizontal: 4 },
});

export default AddTransactionScreen;

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import InputField from '../components/InputField';
import { useTransactionContext } from '../context/TransactionContext';
import { TransactionType } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditTransactionScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { id } = route.params;
  const { transactions, editTransaction, groups } = useTransactionContext();
  const tx = transactions.find(t => t.id === id);
  const [type, setType] = useState<TransactionType>(tx?.type || 'expense');
  const [title, setTitle] = useState(tx?.title || '');
  const [amount, setAmount] = useState(tx ? tx.amount.toString() : '');
  const [date, setDate] = useState(tx ? new Date(tx.date) : new Date());
  const [showDate, setShowDate] = useState(false);
  const [error, setError] = useState('');

  if (!tx) return <Text>Transaction not found</Text>;

  const handleSave = () => {
    if (!title.trim() || !amount || isNaN(Number(amount))) {
      setError('Please enter valid title and amount');
      return;
    }
    editTransaction({
      ...tx,
      type,
      title,
      amount: Number(amount),
      date: date.toISOString(),
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Transaction</Text>
      {tx.groupId && <Text>Group: {groups.find(g => g.id === tx.groupId)?.name || ''}</Text>}
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

export default EditTransactionScreen;

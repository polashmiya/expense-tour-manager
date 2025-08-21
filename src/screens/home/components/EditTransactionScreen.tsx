import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactionContext } from '../../../context/TransactionContext';
import { TransactionType } from '../../../types';
import InputField from '../../../components/InputField';

const EditTransactionScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { id } = route.params;
  const { transactions, editTransaction, groups } = useTransactionContext();
  const tx = transactions.find(t => t.id === id);
  const [type, setType] = useState<TransactionType>(tx?.type || 'expense');
  const [title, setTitle] = useState(tx?.title || '');
  const [amount, setAmount] = useState(tx ? tx.amount.toString() : '');
  const [description, setDescription] = useState(tx?.description || '');
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
      description,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Transaction</Text>
      {tx.groupId && (
        <Text>Group: {groups.find(g => g.id === tx.groupId)?.name || ''}</Text>
      )}
      <View style={styles.row}>
        <Button
          mode={type === 'income' ? 'contained' : 'outlined'}
          onPress={() => setType('income')}
          style={styles.typeBtn}
        >
          Income
        </Button>
        <Button
          mode={type === 'expense' ? 'contained' : 'outlined'}
          onPress={() => setType('expense')}
          style={styles.typeBtn}
        >
          Expense
        </Button>
      </View>
      <View style={styles.inputGap}><InputField
        label="Title"
        value={title}
        onChangeText={setTitle}
        error={error && !title ? error : ''}
      /></View>
      <View style={styles.inputGap}><InputField
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        error={error && (!amount || isNaN(Number(amount))) ? error : ''}
      /></View>
      <View style={styles.inputGap}><InputField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      /></View>

  <Button onPress={() => setShowDate(true)} style={styles.dateBtn}>
        Pick Date: {date.toLocaleDateString()}
      </Button>
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
  <Button mode="contained" onPress={handleSave} style={styles.saveBtn}>
        Save
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 8 },
  typeBtn: { flex: 1, marginHorizontal: 4 },
  inputGap: { marginBottom: 14 },
  dateBtn: { marginVertical: 8 },
  saveBtn: { marginTop: 16 },
});

export default EditTransactionScreen;

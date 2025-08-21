import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTransactionContext } from '../../../context/TransactionContext';

const AllExpenseScreen = () => {
  const { transactions } = useTransactionContext();
  const expenseTransactions = transactions.filter((t: any) => t.type === 'expense');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Expense Transactions</Text>
      <FlatList
        data={expenseTransactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.amount}>-৳ {item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No expense transactions found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 16 },
  amount: { color: 'red', fontWeight: 'bold' },
  date: { color: '#888', fontSize: 12 },
});

export default AllExpenseScreen;

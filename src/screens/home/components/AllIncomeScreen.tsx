import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTransactionContext } from '../../../context/TransactionContext';

const AllIncomeScreen = () => {
  const { transactions } = useTransactionContext();
  const incomeTransactions = transactions.filter((t: any) => t.type === 'income');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Income Transactions</Text>
      <FlatList
        data={incomeTransactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.amount}>+৳ {item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No income transactions found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 16 },
  amount: { color: 'green', fontWeight: 'bold' },
  date: { color: '#888', fontSize: 12 },
});

export default AllIncomeScreen;

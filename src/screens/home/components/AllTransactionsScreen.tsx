import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTransactionContext } from '../../../context/TransactionContext';
import TransactionCard from '../../../components/TransactionCard';

const AllTransactionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { transactions, deleteTransaction } = useTransactionContext();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>All Transactions</Text>
      {transactions.length === 0 && <Text>No transactions found.</Text>}
      {transactions.map(tx => (
        <TransactionCard
          key={tx.id}
          transaction={tx}
          onEdit={() => navigation.navigate('EditTransaction', { id: tx.id })}
          onDelete={() => deleteTransaction(tx.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
});

export default AllTransactionsScreen;

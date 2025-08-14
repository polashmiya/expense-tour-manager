import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { useTransactionContext } from '../context/TransactionContext';
import BalanceSummary from '../components/BalanceSummary';
import GroupCard from '../components/GroupCard';
import TransactionCard from '../components/TransactionCard';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { transactions, groups, deleteTransaction } = useTransactionContext();

  // Personal transactions (no groupId)
  const personalTxs = transactions.filter(t => !t.groupId);
  const personalIncome = personalTxs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const personalExpense = personalTxs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const personalBalance = personalIncome - personalExpense;

  // Group calculations
  const groupSummaries = groups.map(group => {
    const txs = transactions.filter(t => t.groupId === group.id);
    const income = txs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    return { group, income, expense, balance: income - expense };
  });

  // Overall
  const overallIncome = personalIncome + groupSummaries.reduce((a, g) => a + g.income, 0);
  const overallExpense = personalExpense + groupSummaries.reduce((a, g) => a + g.expense, 0);
  const overallBalance = overallIncome - overallExpense;

  // Recent personal transactions
  const recentPersonalTxs = personalTxs.slice(0, 5);

  return (
    <ScrollView style={styles.container}>
      {/* Section 1: Overall Summary */}
      <BalanceSummary income={overallIncome} expense={overallExpense} balance={overallBalance} label="Overall Summary" />
      <Divider style={{ marginVertical: 8 }} />
      {/* Section 2: Quick Actions */}
      <View style={styles.row}>
  <Button mode="contained" buttonColor="#1976d2" onPress={() => navigation.navigate('AddTransaction', { isGroup: false })} style={styles.actionBtn}>Add Personal Transaction</Button>
  <Button mode="contained" buttonColor="#1976d2" onPress={() => navigation.navigate('AddGroup')} style={styles.actionBtn}>Add Group</Button>
      </View>
      <Divider style={{ marginVertical: 8 }} />
      {/* Section 3: Group List */}
      <Text style={styles.sectionTitle}>Groups</Text>
      {groupSummaries.length === 0 && <Text>No groups yet.</Text>}
      {groupSummaries.map(({ group, income, expense, balance }) => (
        <GroupCard
          key={group.id}
          group={group}
          income={income}
          expense={expense}
          balance={balance}
          onPress={() => navigation.navigate('GroupDetails', { groupId: group.id })}
        />
      ))}
      <Divider style={{ marginVertical: 8 }} />
      {/* Section 4: Recent Personal Transactions */}
      <Text style={styles.sectionTitle}>Recent Personal Transactions</Text>
      {recentPersonalTxs.length === 0 && <Text>No personal transactions yet.</Text>}
      {recentPersonalTxs.map(tx => (
        <TransactionCard
          key={tx.id}
          transaction={tx}
          onEdit={() => navigation.navigate('EditTransaction', { id: tx.id })}
          onDelete={() => deleteTransaction(tx.id)}
        />
      ))}
  <Button buttonColor="#1976d2" textColor="#fff" onPress={() => navigation.navigate('AllPersonalTransactions')}>View All</Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  actionBtn: { flex: 1, marginHorizontal: 4 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginVertical: 8 },
});

export default HomeScreen;

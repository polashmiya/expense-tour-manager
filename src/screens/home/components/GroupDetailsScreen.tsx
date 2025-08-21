import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { useTransactionContext } from '../../../context/TransactionContext';
import BalanceSummary from '../../../components/BalanceSummary';
import TransactionCard from '../../../components/TransactionCard';
const GroupDetailsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { groups, transactions, deleteGroup, deleteTransaction } = useTransactionContext();
  const group = groups.find(g => g.id === groupId);
  if (!group) return <Text>Group not found</Text>;
  const groupTxs = transactions.filter(t => t.groupId === groupId);
  const income = groupTxs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = groupTxs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group and all its transactions?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { deleteGroup(groupId); navigation.goBack(); } },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <BalanceSummary income={income} expense={expense} balance={balance} label={group.name} />
      <View style={styles.row}>
        <Button onPress={() => navigation.navigate('EditGroup', { groupId })}>Edit Group</Button>
        <Button onPress={handleDeleteGroup} color="red">Delete Group</Button>
      </View>
      <Divider style={{ marginVertical: 8 }} />
      <Button mode="contained" onPress={() => navigation.navigate('AddTransaction', { isGroup: true, groupId })} style={{ marginBottom: 8 }}>Add Transaction</Button>
      <Text style={styles.sectionTitle}>Transactions</Text>
      {groupTxs.length === 0 && <Text>No transactions in this group yet.</Text>}
      {groupTxs.map(tx => (
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
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, marginVertical: 8 },
});

export default GroupDetailsScreen;

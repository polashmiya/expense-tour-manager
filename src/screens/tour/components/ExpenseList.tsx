
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Tour } from '../../../types/tour';
import { IconButton, Card, useTheme } from 'react-native-paper';
import { deleteExpenseFromTour } from '../../../storage/tourStorage';
import { useNavigation } from '@react-navigation/native';

type ExpenseListProps = {
  tour: Tour;
  onExpenseDeleted?: () => void;
};

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  AddExpense: { tour: Tour };
  // ...other routes
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;

type ExpenseDeleteButtonProps = {
  expenseId: string;
  onDelete: (id: string) => void;
  disabled: boolean;
  color: string;
};

function ExpenseDeleteButton({ expenseId, onDelete, disabled, color }: ExpenseDeleteButtonProps) {
  return (
    <IconButton
      icon="delete"
      iconColor={color}
      onPress={() => onDelete(expenseId)}
      accessibilityLabel="Delete Expense"
      disabled={disabled}
    />
  );
}

const ExpenseList = ({ tour, onExpenseDeleted }: ExpenseListProps) => {
  const theme = useTheme();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const expenses = tour.expenses.slice().reverse();

  const handleDelete = (expenseId: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLoadingId(expenseId);
            // Use setTimeout to allow Alert to close before running async code
            setTimeout(async () => {
              await deleteExpenseFromTour(tour.id, expenseId);
              setLoadingId(null);
              if (onExpenseDeleted) onExpenseDeleted();
            }, 100);
          },
        },
      ]
    );
  };


  const rightAction = (expenseId: string) => () => (
    <ExpenseDeleteButton
      expenseId={expenseId}
      onDelete={handleDelete}
      disabled={loadingId === expenseId}
      color={theme.colors.error}
    />
  );

  const renderExpense = ({ item }: { item: Tour['expenses'][0] }) => {
    const paidByName = tour.members.find(m => m.id === item.paidBy)?.name || 'Unknown';
    const participantNames = item.participants.map((pid: string) => tour.members.find(m => m.id === pid)?.name).join(', ');
    return (
      <Card style={styles.card}>
        <Card.Title
          title={item.description}
          titleStyle={styles.cardTitle}
          right={rightAction(item.id)}
        />
        <Card.Content>
          <View style={styles.rowBetween}>
            <Text style={styles.amount}>৳ {item.amount.toFixed(2)}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.paidBy}>Paid by: <Text style={styles.bold}>{paidByName}</Text></Text>
          <Text style={styles.participants}>Paid For: <Text style={styles.bold}>{participantNames}</Text></Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Expenses</Text>
        <IconButton
          icon="plus"
          size={26}
          iconColor={theme.colors.primary}
          style={styles.addButton}
          onPress={() => navigation.navigate('AddExpense', { tour })}
          accessibilityLabel="Add Expense"
        />
      </View>
      <View style={styles.hr} />
      {expenses.length === 0 ? (
        <Text style={styles.emptyText}>No expenses found.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          renderItem={renderExpense}
          contentContainerStyle={[styles.marginTop16, styles.paddingBottomExtra]}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  marginTop16: {
    marginTop: 16,
  },
  paddingBottom24: {
    paddingBottom: 24,
  },
  paddingBottomExtra: {
    paddingBottom: 80,
  },
  // Removed duplicate style keys
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  hr: {
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    marginVertical: 8,
    marginHorizontal: 4,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#2563eb',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: '#e0e7ff',
    borderRadius: 24,
    margin: 0,
    elevation: 2,
  },
  card: {
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#43a047',
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  paidBy: {
    fontSize: 15,
    color: '#333',
    marginTop: 2,
  },
  participants: {
    fontSize: 15,
    color: '#333',
    marginTop: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 24,
    fontSize: 16,
  },
  flex1: {
    flex: 1,
  },
});

export default ExpenseList;

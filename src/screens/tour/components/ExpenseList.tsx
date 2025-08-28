
// Move styles after component
import { StyleSheet } from 'react-native';

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  modalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#43a047',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2563eb',
  },
  modalValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  modalDescription: {
    fontSize: 15,
    color: '#444',
    marginTop: 2,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 18,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

import React, { useState } from 'react';
import { View, Text, FlatList, Alert, SafeAreaView, Modal, TouchableOpacity, Pressable, ScrollView } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Tour['expenses'][0] | null>(null);
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
      <TouchableOpacity activeOpacity={0.8} onPress={() => { setSelectedExpense(item); setModalVisible(true); }}>
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
      </TouchableOpacity>
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
      {/* <View style={styles.hr} /> */}
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

      {/* Modal for full expense details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedExpense?.description}</Text>
              <Text style={styles.modalAmount}>৳ {selectedExpense?.amount.toFixed(2)}</Text>
              <Text style={styles.modalLabel}>Date:</Text>
              <Text style={styles.modalValue}>{selectedExpense ? new Date(selectedExpense.date).toLocaleDateString() : ''}</Text>
              <Text style={styles.modalLabel}>Paid by:</Text>
              <Text style={styles.modalValue}>{selectedExpense ? tour.members.find(m => m.id === selectedExpense.paidBy)?.name : ''}</Text>
              <Text style={styles.modalLabel}>Paid for:</Text>
              <Text style={styles.modalValue}>{selectedExpense ? selectedExpense.participants.map((pid: string) => tour.members.find(m => m.id === pid)?.name).join(', ') : ''}</Text>
              {selectedExpense?.description && (
                <>
                  <Text style={styles.modalLabel}>Full Description:</Text>
                  <Text style={styles.modalDescription}>{selectedExpense.description}</Text>
                </>
              )}
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
export default ExpenseList;




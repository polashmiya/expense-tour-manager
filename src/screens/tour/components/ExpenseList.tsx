import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Tour } from '../../../types/tour';

const ExpenseList = ({ tour, selectedMember }: { tour: Tour, selectedMember: string | null }) => {
  const expenses = selectedMember
    ? tour.expenses.filter(e => e.paidBy === selectedMember || e.participants.includes(selectedMember))
    : tour.expenses;

  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text>{item.description} - {item.amount} (Paid by: {tour.members.find(m => m.id === item.paidBy)?.name})</Text>
            <Text>Participants: {item.participants.map(pid => tour.members.find(m => m.id === pid)?.name).join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ExpenseList;

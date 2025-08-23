import React from 'react';
import { View, Text } from 'react-native';
import { Tour } from '../../../types/tour';

function calculateBalances(tour: Tour) {
  const balances: { [id: string]: number } = {};
  tour.members.forEach(m => { balances[m.id] = 0; });
  tour.expenses.forEach(exp => {
    const share = exp.amount / exp.participants.length;
    exp.participants.forEach(pid => {
      balances[pid] -= share;
    });
    balances[exp.paidBy] += exp.amount;
  });
  return balances;
}

const BalanceSummary = ({ tour, selectedMember }: { tour: Tour, selectedMember: string | null }) => {
  const balances = calculateBalances(tour);
  const showMembers = selectedMember ? [tour.members.find(m => m.id === selectedMember)!] : tour.members;
  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ fontWeight: 'bold' }}>Balances:</Text>
      {showMembers.map(m => (
        <Text key={m.id}>{m.name}: {balances[m.id] >= 0 ? '+' : ''}{balances[m.id].toFixed(2)}</Text>
      ))}
    </View>
  );
};

export default BalanceSummary;

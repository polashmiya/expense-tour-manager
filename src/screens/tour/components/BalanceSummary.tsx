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

const BalanceSummary = ({ tour }: { tour: Tour }) => {
  const balances = calculateBalances(tour);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Balances</Text>
      {tour.members.map(m => (
        <View key={m.id} style={styles.row}>
          <Text style={styles.name}>{m.name}</Text>
          {(() => {
            const val = balances[m.id];
            const displayVal = Math.abs(val) < 0.009 ? 0 : val;
            let style = styles.zero;
            if (displayVal > 0) style = styles.positive;
            else if (displayVal < 0) style = styles.negative;
            let sign = '';
            if (displayVal > 0) sign = '+';
            else if (displayVal < 0) sign = '-';
            return (
              <Text style={[styles.amount, style]}>
                {'৳ ' + sign + Math.abs(displayVal).toFixed(2)}
              </Text>
            );
          })()}
        </View>
      ))}
    </View>
  );
};


const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold' as const,
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center' as const,
  },
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 16,
    color: '#444',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  positive: {
    color: '#2ecc40',
  },
  negative: {
    color: '#ff4136',
  },
  zero: {
    color: '#888',
  },
};

export default BalanceSummary;

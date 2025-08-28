import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tour, TourMember, TourExpense } from '../../../types/tour';


// Helper to calculate settlements
type Settlement = { from: string; to: string; amount: number };
function calculateSettlements(tour: Tour): Settlement[] {
  const balances: Record<string, number> = {};
  tour.members.forEach((m: TourMember) => {
    balances[m.id] = 0;
  });

  // Calculate net balance for each member
  tour.expenses.forEach((exp: TourExpense) => {
    const share = exp.amount / exp.participants.length;
    exp.participants.forEach((pid: string) => {
      balances[pid] -= share;
    });
    balances[exp.paidBy] += exp.amount;
  });

  // Prepare creditors and debtors
  const creditors = Object.entries(balances)
    .filter(([_, b]) => b > 0)
    .map(([id, b]) => ({ id, amount: b }));
  const debtors = Object.entries(balances)
    .filter(([_, b]) => b < 0)
    .map(([id, b]) => ({ id, amount: -b }));

  // Greedy settlement
  const settlements: Settlement[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);
    settlements.push({ from: debtors[i].id, to: creditors[j].id, amount: pay });
    debtors[i].amount -= pay;
    creditors[j].amount -= pay;
    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }
  return settlements;
}

const SettlementSummary = ({ tour }: { tour: Tour }) => {
  if (!tour || tour.members.length === 0 || tour.expenses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Who Pays Whom</Text>
        <Text style={styles.settledText}>No settlements to show.</Text>
      </View>
    );
  }
  // Filter out settlements where amount is very close to zero (floating point safe)
  const settlements = calculateSettlements(tour).filter((s) => s.amount > 0.009);
  const memberMap = Object.fromEntries(tour.members.map((m: TourMember) => [m.id, m.name]));
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Who Pays Whom</Text>
      {settlements.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.emoji}>✅</Text>
          <Text style={styles.settledText}>All settled up!</Text>
        </View>
      ) : (
        settlements.map((s) => (
          <View key={s.from + '-' + s.to} style={styles.card}>
            <Text style={styles.emoji}>🔄</Text>
            <Text style={styles.payer}>{memberMap[s.from]}</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.payee}>{memberMap[s.to]}</Text>
            <Text style={styles.amount}>৳ {s.amount.toFixed(2)}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
    color: '#1976D2',
    letterSpacing: 0.2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
  },
  arrow: {
    fontSize: 16,
    marginHorizontal: 4,
    color: '#757575',
  },
  payer: {
    fontWeight: '600',
    color: '#E53935',
    fontSize: 15,
    marginRight: 2,
  },
  payee: {
    fontWeight: '600',
    color: '#388E3C',
    fontSize: 15,
    marginLeft: 2,
  },
  amount: {
    marginLeft: 'auto',
    fontWeight: 'bold',
    color: '#1976D2',
    fontSize: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  settledText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 4,
  },
});

export default SettlementSummary;

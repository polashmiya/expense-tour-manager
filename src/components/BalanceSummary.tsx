import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';

interface Props {
  income: number;
  expense: number;
  balance: number;
  label?: string;
}

const BalanceSummaryLeft = () => (
  <Avatar.Icon icon="chart-donut" style={styles.avatarSmall} color="#fff" size={24} />
);

const BalanceSummary: React.FC<Props> = ({ income, expense, balance, label }) => (
  <Card style={styles.card}>
    <Card.Title
      title={label || 'Summary'}
      left={BalanceSummaryLeft}
    />
    <Card.Content>
      <View style={styles.row}>
        <Text style={styles.income}>Income: ${income.toFixed(2)}</Text>
        <Text style={styles.expense}>Expense: ${expense.toFixed(2)}</Text>
        <Text style={styles.balance}>Balance: ${balance.toFixed(2)}</Text>
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: '#fff',
  },
  avatar: {
    backgroundColor: '#ff9800',
  },
  avatarSmall: {
    backgroundColor: '#ff9800',
    marginLeft: 0,
    marginRight: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  income: { color: '#4caf50', fontWeight: 'bold' },
  expense: { color: '#f44336', fontWeight: 'bold' },
  balance: { color: '#333', fontWeight: 'bold' },
});

export default BalanceSummary;

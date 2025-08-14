import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
      <View style={styles.summaryCol}>
        <View style={styles.summaryRow}>
          <MaterialCommunityIcons name="arrow-down-bold-circle" color="#1976d2" size={28} style={styles.icon} />
          <View>
            <Text style={styles.labelText}>Income</Text>
            <Text style={styles.income}>${income.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <MaterialCommunityIcons name="arrow-up-bold-circle" color="#f44336" size={28} style={styles.icon} />
          <View>
            <Text style={styles.labelText}>Expense</Text>
            <Text style={styles.expense}>${expense.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <MaterialCommunityIcons name="wallet" color="#1976d2" size={28} style={styles.icon} />
          <View>
            <Text style={styles.labelText}>Balance</Text>
            <Text style={styles.balance}>${balance.toFixed(2)}</Text>
          </View>
        </View>
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
    backgroundColor: '#1976d2',
  },
  avatarSmall: {
    backgroundColor: '#1976d2',
    marginLeft: 0,
    marginRight: 0,
  },
  summaryCol: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  icon: {
    marginRight: 12,
  },
  labelText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  income: { color: '#1976d2', fontWeight: 'bold' },
  expense: { color: '#f44336', fontWeight: 'bold' },
  balance: { color: '#333', fontWeight: 'bold' },
});

export default BalanceSummary;

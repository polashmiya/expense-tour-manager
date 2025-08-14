import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { Group } from '../types';

interface Props {
  group: Group;
  income: number;
  expense: number;
  balance: number;
  onPress: () => void;
}

const GroupCardLeft = () => (
  <Avatar.Icon icon="account-group" style={styles.avatarSmall} color="#fff" size={24} />
);

const GroupCard: React.FC<Props> = ({ group, income, expense, balance, onPress }) => (
  <Card style={styles.card} onPress={onPress}>
    <Card.Title
      title={group.name}
      left={GroupCardLeft}
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
    backgroundColor: '#1976d2',
  },
  avatarSmall: {
    backgroundColor: '#1976d2',
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

export default GroupCard;

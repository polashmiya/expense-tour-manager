import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, IconButton } from 'react-native-paper';
import { Group } from '../types';


interface Props {
  group: Group;
  income: number;
  expense: number;
  balance: number;
  onPress: () => void;
  onAddTransaction?: () => void;
}

const GroupCardLeft = () => (
  <Avatar.Icon icon="account-group" style={styles.avatarSmall} color="#fff" size={24} />
);


const AddTransactionButton = ({ onAddTransaction }: { onAddTransaction: (() => void) | undefined }) =>
  onAddTransaction ? (
    <IconButton
      icon="plus-circle"
      size={28}
      onPress={(e) => {
        e.stopPropagation();
        onAddTransaction();
      }}
      accessibilityLabel="Add Transaction to Group"
    />
  ) : null;


const GroupCard: React.FC<Props> = ({ group, income, expense, balance, onPress, onAddTransaction }) => {
  const renderRight = useCallback(
    (props: { size: number }) => <AddTransactionButton onAddTransaction={onAddTransaction} {...props} />,
    [onAddTransaction]
  );
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title
        title={group.name}
        left={GroupCardLeft}
        right={renderRight}
      />
      <Card.Content>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Income</Text>
            <Text style={styles.income}>৳{income.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Expense</Text>
            <Text style={styles.expense}>৳{expense.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Balance</Text>
            <Text style={styles.balance}>৳{balance.toFixed(2)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

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
  infoContainer: {
    marginTop: 8,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontWeight: '600',
    color: '#888',
    fontSize: 15,
  },
  income: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  expense: {
    color: '#f44336',
    fontWeight: 'bold',
    fontSize: 16,
  },
  balance: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GroupCard;

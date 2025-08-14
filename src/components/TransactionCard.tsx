import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Avatar } from 'react-native-paper';
import { Transaction } from '../types';

interface Props {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

const TransactionCardLeft = ({ isIncome }: { isIncome: boolean }) => (
  <Avatar.Icon
    icon={isIncome ? 'arrow-down-bold-circle' : 'arrow-up-bold-circle'}
    style={[styles.avatarSmall, isIncome ? styles.incomeBg : styles.expenseBg]}
    color="#fff"
    size={22}
  />
);

const TransactionCardRight = ({ isIncome, amount, onEdit, onDelete }: { isIncome: boolean; amount: number; onEdit: () => void; onDelete: () => void }) => (
  <View style={styles.rightContainer}>
    <View style={[styles.amountBox, isIncome ? styles.incomeBgLight : styles.expenseBgLight]}>
      <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
        {isIncome ? '+' : '-'}${amount.toFixed(2)}
      </Text>
    </View>
    <IconButton icon="pencil" onPress={onEdit} style={styles.iconBtn} size={18} />
    <IconButton icon="delete" onPress={onDelete} style={styles.iconBtn} size={18} />
  </View>
);

const TransactionCard: React.FC<Props> = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';

  // Memoize left and right renderers to avoid inline component definitions
  const renderLeft = React.useCallback(() => <TransactionCardLeft isIncome={isIncome} />, [isIncome]);
  const renderRight = React.useCallback(
    () => <TransactionCardRight isIncome={isIncome} amount={transaction.amount} onEdit={onEdit} onDelete={onDelete} />,
    [isIncome, transaction.amount, onEdit, onDelete]
  );

  return (
    <Card style={styles.card}>
      <Card.Title
        title={<Text style={styles.title}>{transaction.title}</Text>}
        subtitle={<Text style={styles.date}>{new Date(transaction.date).toLocaleDateString()}</Text>}
        left={renderLeft}
        right={renderRight}
        style={styles.cardTitle}
      />
      <Card.Content style={styles.cardContent}></Card.Content>
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
    backgroundColor: '#888',
  },
  incomeBg: {
    backgroundColor: '#4caf50',
  },
  expenseBg: {
    backgroundColor: '#f44336',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  amountBox: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    minWidth: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeBgLight: {
    backgroundColor: '#e8f5e9',
  },
  expenseBgLight: {
    backgroundColor: '#ffebee',
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    color: '#222',
    letterSpacing: 0.1,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  cardTitle: {
    minHeight: 48,
    paddingBottom: 0,
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  iconBtn: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  avatarSmall: {
    backgroundColor: '#888',
    marginLeft: 0,
    marginRight: 0,
  },
  income: { color: '#4caf50' },
  expense: { color: '#f44336' },
});

export default TransactionCard;

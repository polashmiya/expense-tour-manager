import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

const TX_KEY = 'transactions';

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const data = await AsyncStorage.getItem(TX_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = async (txs: Transaction[]) => {
  await AsyncStorage.setItem(TX_KEY, JSON.stringify(txs));
};

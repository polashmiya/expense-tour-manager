// Local storage logic for tours using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tour, TourBalance } from '../types/tour';


const TOURS_KEY = 'TOURS_DATA';

export const getTours = async (): Promise<Tour[]> => {
  const data = await AsyncStorage.getItem(TOURS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTours = async (tours: Tour[]): Promise<void> => {
  await AsyncStorage.setItem(TOURS_KEY, JSON.stringify(tours));
};

export const addTour = async (tour: Tour): Promise<void> => {
  const tours = await getTours();
  tours.push(tour);
  await saveTours(tours);
};

export const updateTour = async (updatedTour: Tour): Promise<void> => {
  const tours = await getTours();
  const idx = tours.findIndex(t => t.id === updatedTour.id);
  if (idx !== -1) {
    tours[idx] = updatedTour;
    await saveTours(tours);
  }
};

export const deleteTour = async (tourId: string): Promise<void> => {
  const tours = await getTours();
  const filtered = tours.filter(t => t.id !== tourId);
  await saveTours(filtered);
};

// Calculate balances for each member in a tour
export const calculateTourBalances = (tour: Tour): TourBalance[] => {
  const balances: { [memberId: string]: number } = {};
  tour.members.forEach(m => {
    balances[m.id] = 0;
  });
  tour.expenses.forEach(exp => {
    const split = exp.amount / exp.participants.length;
    exp.participants.forEach(pid => {
      balances[pid] -= split;
    });
    balances[exp.paidBy] += exp.amount;
  });
  return Object.entries(balances).map(([memberId, balance]) => ({ memberId, balance }));
};

// Settle up balances: returns a list of transactions to settle debts
export const getSettleUpTransactions = (tour: Tour) => {
  const balances = calculateTourBalances(tour).map(b => ({ ...b }));
  const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
  const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const settlements: { from: string; to: string; amount: number }[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(-debtor.balance, creditor.balance);
    if (amount > 0) {
      settlements.push({ from: debtor.memberId, to: creditor.memberId, amount });
      debtor.balance += amount;
      creditor.balance -= amount;
    }
    if (Math.abs(debtor.balance) < 0.01) i++;
    if (Math.abs(creditor.balance) < 0.01) j++;
  }
  return settlements;
};

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string; // ISO string
  groupId?: string; // undefined for personal
}

export interface Group {
  id: string;
  name: string;
}

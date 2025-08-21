import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction, Group } from '../types';
import { getAllTransactions, saveTransactions } from '../storage/transactionStorage';
import { getAllGroups, saveGroups } from '../storage/groupStorage';

interface TransactionContextProps {
  transactions: Transaction[];
  groups: Group[];
  addTransaction: (tx: Transaction) => void;
  editTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addGroup: (group: Group) => void;
  editGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

export const useTransactionContext = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactionContext must be used within TransactionProvider');
  return ctx;
};


export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [txs, grps] = await Promise.all([
        getAllTransactions(),
        getAllGroups(),
      ]);
      setTransactions(txs);
      setGroups(grps);
      setLoading(false);
    })();
  }, []);

  useEffect(() => { if (!loading) saveTransactions(transactions); }, [transactions, loading]);
  useEffect(() => { if (!loading) saveGroups(groups); }, [groups, loading]);

  const addTransaction = (tx: Transaction) => setTransactions(txs => [tx, ...txs]);
  const editTransaction = (tx: Transaction) => setTransactions(txs => txs.map(t => t.id === tx.id ? tx : t));
  const deleteTransaction = (id: string) => setTransactions(txs => txs.filter(t => t.id !== id));

  const addGroup = (group: Group) => setGroups(gs => [group, ...gs]);
  const editGroup = (group: Group) => setGroups(gs => gs.map(g => g.id === group.id ? group : g));
  const deleteGroup = (id: string) => {
    setGroups(gs => gs.filter(g => g.id !== id));
    setTransactions(txs => txs.filter(t => t.groupId !== id));
  };

  if (loading) {
    return null; // or a loading spinner if you want
  }

  return (
    <TransactionContext.Provider value={{ transactions, groups, addTransaction, editTransaction, deleteTransaction, addGroup, editGroup, deleteGroup }}>
      {children}
    </TransactionContext.Provider>
  );
};

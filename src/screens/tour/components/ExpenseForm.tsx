import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Tour, TourExpense } from '../../../types/tour';
import { updateTour } from '../../../storage/tourStorage';
import uuid from 'react-native-uuid';

const ExpenseForm = ({ tour, onClose }: { tour: Tour, onClose: () => void }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(tour.members[0]?.id || '');
  const [participants, setParticipants] = useState<string[]>(tour.members.map(m => m.id));

  const handleSubmit = async () => {
    if (!description.trim() || !amount || !paidBy || participants.length === 0) return;
    const expense: TourExpense = {
      id: uuid.v4().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy,
      participants,
      date: new Date().toISOString(),
    };
    const updatedTour = { ...tour, expenses: [...tour.expenses, expense] };
    await updateTour(updatedTour);
    onClose();
  };

  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Add Expense</Text>
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderBottomWidth: 1 }} />
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ borderBottomWidth: 1 }} />
      <Text>Paid By:</Text>
      {/* Simple dropdown for paidBy */}
      <View>
        {tour.members.map(m => (
          <Button key={m.id} title={m.name} onPress={() => setPaidBy(m.id)} color={paidBy === m.id ? 'green' : undefined} />
        ))}
      </View>
      <Text>Participants:</Text>
      <View>
        {tour.members.map(m => (
          <Button
            key={m.id}
            title={m.name + (participants.includes(m.id) ? ' ✓' : '')}
            onPress={() => setParticipants(
              participants.includes(m.id)
                ? participants.filter(id => id !== m.id)
                : [...participants, m.id]
            )}
          />
        ))}
      </View>
      <Button title="Add" onPress={handleSubmit} />
      <Button title="Cancel" onPress={onClose} color="red" />
    </View>
  );
};

export default ExpenseForm;

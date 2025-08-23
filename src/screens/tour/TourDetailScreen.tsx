import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { getTours, updateTour } from '../../storage/tourStorage';
import { Tour, TourMember, TourExpense } from '../../types/tour';
import ExpenseList from './components/ExpenseList';
import MemberDropdown from './components/MemberDropdown';
import BalanceSummary from './components/BalanceSummary';
import ExpenseForm from './components/ExpenseForm';
import { useRoute } from '@react-navigation/native';

const TourDetailScreen = () => {
  const route = useRoute();
  const { tourId } = route.params as { tourId: string };
  const [tour, setTour] = useState<Tour | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const loadTour = async () => {
    const tours = await getTours();
    setTour(tours.find(t => t.id === tourId) || null);
  };

  useEffect(() => {
    loadTour();
  }, []);

  if (!tour) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{tour.name}</Text>
      <Text>{tour.description}</Text>
      <MemberDropdown members={tour.members} selected={selectedMember} onSelect={setSelectedMember} />
      <BalanceSummary tour={tour} selectedMember={selectedMember} />
      <Button title="Add Expense" onPress={() => setShowExpenseForm(true)} />
      {showExpenseForm && <ExpenseForm tour={tour} onClose={() => { setShowExpenseForm(false); loadTour(); }} />}
      <ExpenseList tour={tour} selectedMember={selectedMember} />
    </View>
  );
};

export default TourDetailScreen;

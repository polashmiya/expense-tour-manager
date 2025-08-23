import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTours } from '../../storage/tourStorage';
import { Tour } from '../../types/tour';
import ExpenseList from './components/ExpenseList';
import BalanceSummary from './components/BalanceSummary';
import { useRoute, useNavigation } from '@react-navigation/native';

const TourDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // Defensive: handle missing params
  const tourId = (route as any)?.params?.tourId;
  const [tour, setTour] = useState<Tour | null>(null);


  const loadTour = useCallback(async () => {
    if (!tourId) return;
    const tours = await getTours();
    setTour(tours.find(t => t.id === tourId) || null);
  }, [tourId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTour);
    loadTour();
    return unsubscribe;
  }, [navigation, loadTour]);

  if (!tourId) return <Text>Invalid tour selected.</Text>;
  if (!tour) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tour.name}</Text>
      <Text>{tour.description}</Text>
      <BalanceSummary tour={tour} />
  {/* Add Expense button removed as per lint suggestion */}
      <ExpenseList tour={tour} onExpenseDeleted={loadTour} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default TourDetailScreen;

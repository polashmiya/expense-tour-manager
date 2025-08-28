import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { getTours, deleteTour } from '../../storage/tourStorage';
import { Tour } from '../../types/tour';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  TourDetail: { tourId: string };
  CreateTour: { editTour?: Tour } | undefined;
  AddExpense: { tour: Tour };
};

const TourScreen = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const loadTours = async () => {
    const data = await getTours();
    setTours(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTours);
    loadTours();
    return unsubscribe;
  }, [navigation]);

  const handleDeleteTour = async (tourId: string) => {
    await deleteTour(tourId);
    loadTours();
  };

  const renderTour = ({ item }: { item: Tour }) => (
    <Card style={styles.card}>
      <View style={styles.cardContentRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TourDetail', { tourId: item.id })}
          style={styles.tourTouchable}
        >
          <Card.Title title={item.name} titleStyle={styles.cardTitle} />
          {item?.description && (
            <Card.Content>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </Card.Content>
          )}
        </TouchableOpacity>
        <View style={styles.iconBtnGroup}>
          <IconButton
            icon="plus"
            size={22}
            onPress={() => navigation.navigate('AddExpense', { tour: item })}
            style={styles.addExpenseBtn}
            accessibilityLabel="Add Expense to Tour"
          />
          <IconButton
            icon="pencil"
            size={22}
            onPress={() => navigation.navigate('CreateTour', { editTour: item })}
            style={styles.editBtn}
            accessibilityLabel="Edit Tour"
          />
          <IconButton
            icon="delete"
            size={22}
            onPress={() => handleDeleteTour(item.id)}
            style={styles.deleteBtn}
            accessibilityLabel="Delete Tour"
            // containerColor="#ffe0e0"
          />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <IconButton
          icon="plus"
          size={28}
          onPress={() => navigation.navigate('CreateTour')}
          style={styles.plusBtn}
          accessibilityLabel="Create Tour"
        />
      </View>
      <FlatList
        data={tours}
        keyExtractor={item => item.id}
        renderItem={renderTour}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tours found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  plusBtn: {
    margin: 0,
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
  },
  addExpenseBtn: {
    margin: 0,
    // backgroundColor: '#e0ffe0',
    borderRadius: 16,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: '#e3f0ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  iconBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 4,
  },
  editBtn: {
    margin: 0,
    borderRadius: 16,
  },
  deleteBtn: {
    margin: 0,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a2a2a',
    letterSpacing: 0.2,
  },
  cardDesc: {
    fontSize: 16,
    color: '#4a4a4a',
    marginTop: 2,
  },
  tourTouchable: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 8,
    borderRadius: 12,
  },
  flatListContent: {
    paddingBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 18,
    fontStyle: 'italic',
  },
});

export default TourScreen;

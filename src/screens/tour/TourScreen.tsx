
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { getTours, deleteTour } from '../../storage/tourStorage';
import { Tour } from '../../types/tour';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  TourDetail: { tourId: string };
  CreateTour: undefined;
};

const TourScreen = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
      <TouchableOpacity
        onPress={() => navigation.navigate('TourDetail', { tourId: item.id })}
        style={styles.tourTouchable}
      >
        <Card.Title title={item.name} titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </Card.Content>
      </TouchableOpacity>
      <IconButton
        icon="delete"
        size={24}
        onPress={() => handleDeleteTour(item.id)}
        style={styles.deleteBtn}
        accessibilityLabel="Delete Tour"
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Tours</Text>
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
        ListEmptyComponent={<Text style={styles.emptyText}>No tours found.</Text>}
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  plusBtn: {
    margin: 0,
  },
  card: {
    marginBottom: 14,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  deleteBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDesc: {
    fontSize: 16,
    color: '#666',
  },
  tourTouchable: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 18,
  },
});

export default TourScreen;

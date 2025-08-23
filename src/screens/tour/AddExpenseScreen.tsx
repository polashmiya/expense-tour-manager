
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Tour, TourExpense } from '../../types/tour';
import { updateTour } from '../../storage/tourStorage';
import uuid from 'react-native-uuid';

const AddExpenseScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { tour } = (route as { params: { tour: Tour } }).params;
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(tour.members[0]?.id?.toString() || '');
  const [participants, setParticipants] = useState<string[]>(tour.members.map((m: Tour['members'][0]) => m.id));
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!description.trim() || !amount || !paidBy || participants.length === 0) {
      setError('Please fill all fields and select at least one participant.');
      return;
    }
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
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Add Expense</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Expense description"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Paid By</Text>
      <View style={styles.paidByWrapperFixed}>
        <Picker
          selectedValue={paidBy}
          onValueChange={itemValue => setPaidBy(itemValue.toString())}
          enabled={tour.members.length > 0}
          style={styles.pickerMinimal}
          dropdownIconColor="#222"
        >
          {tour.members.length === 0 ? (
            <Picker.Item label="No members available" value="" />
          ) : (
            tour.members.map((m: Tour['members'][0]) => (
              <Picker.Item key={m.id} label={m.name} value={m.id.toString()} color={paidBy === m.id.toString() ? '#222' : '#555'} />
            ))
          )}
        </Picker>
      </View>
      <Text style={styles.label}>Paid For</Text>
      <View style={styles.cardField}>
        {tour.members.length === 0 ? (
          <Picker enabled={false} style={styles.pickerFull}>
            <Picker.Item label="No members available" value="" />
          </Picker>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.participantsScroll}>
            {tour.members.map((m: Tour['members'][0]) => (
              <View key={m.id} style={styles.participantChipWrapper}>
                <Button
                  mode={participants.includes(m.id) ? 'contained' : 'outlined'}
                  onPress={() => {
                    setParticipants(prev =>
                      prev.includes(m.id)
                        ? prev.filter(pid => pid !== m.id)
                        : [...prev, m.id]
                    );
                  }}
                  style={styles.participantChip}
                  compact
                  labelStyle={styles.participantChipLabel}
                >
                  {m.name}
                </Button>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.addBtn}
        contentStyle={{ paddingVertical: 8 } as any}
      >
        Add Expense
      </Button>
      <Button onPress={() => navigation.goBack()} style={styles.cancelBtn}>
        Cancel
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  paidByWrapperFixed: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 0,
    minHeight: 48,
    justifyContent: 'center',
    width: '100%',
  },
  pickerMinimal: {
    width: '100%',
    color: '#222',
  },
  pickerNative: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    color: '#222',
    fontSize: 19,
    fontWeight: 'bold',
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 10,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    // For Android
    minHeight: 48,
  },
  paidByWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    marginBottom: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    minHeight: 52,
    width: '100%',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    padding: 24,
    alignItems: 'stretch',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardField: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardFieldCentered: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    marginBottom: 12,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  pickerFull: {
    width: '100%',
    height: 44,
    backgroundColor: 'transparent',
    marginLeft: 0,
    marginRight: 0,
    alignSelf: 'stretch',
  },
  pickerItem: {
    fontSize: 17,
    color: '#222',
    minWidth: 120,
    height: 44,
    fontWeight: 'bold',
  },
  participantsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  participantChipWrapper: {
    marginRight: 8,
    marginBottom: 4,
  },
  participantChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 2,
    minWidth: 60,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  participantChipLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    textTransform: 'capitalize',
  },
  addBtn: {
    marginTop: 24,
    borderRadius: 8,
    backgroundColor: '#4caf50',
  },
  cancelBtn: {
    marginTop: 8,
    borderRadius: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  dropdownWrapper: {
    zIndex: 100,
    position: 'relative'
  },
});

export default AddExpenseScreen;

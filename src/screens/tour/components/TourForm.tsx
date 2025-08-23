import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { addTour } from '../../../storage/tourStorage';
import { Tour, TourMember } from '../../../types/tour';
import uuid from 'react-native-uuid';

const TourForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState<TourMember[]>([]);
  const [memberName, setMemberName] = useState('');

  const addMember = () => {
    if (memberName.trim()) {
      setMembers([...members, { id: uuid.v4().toString(), name: memberName.trim() }]);
      setMemberName('');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const tour: Tour = {
      id: uuid.v4().toString(),
      name: name.trim(),
      description: description.trim(),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      createDate: new Date().toISOString(),
      members,
      expenses: [],
    };
    await addTour(tour);
    onClose();
  };

  return (
    <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Create Tour</Text>
      <TextInput placeholder="Tour Name" value={name} onChangeText={setName} style={{ borderBottomWidth: 1 }} />
      <TextInput placeholder="Description (optional)" value={description} onChangeText={setDescription} style={{ borderBottomWidth: 1 }} />
      <TextInput placeholder="Start Date (optional)" value={startDate} onChangeText={setStartDate} style={{ borderBottomWidth: 1 }} />
      <TextInput placeholder="End Date (optional)" value={endDate} onChangeText={setEndDate} style={{ borderBottomWidth: 1 }} />
      <Text style={{ marginTop: 8 }}>Members:</Text>
      {members.map(m => <Text key={m.id}>- {m.name}</Text>)}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput placeholder="Add member" value={memberName} onChangeText={setMemberName} style={{ flex: 1, borderBottomWidth: 1 }} />
        <Button title="Add" onPress={addMember} />
      </View>
      <Button title="Create" onPress={handleSubmit} />
      <Button title="Cancel" onPress={onClose} color="red" />
    </View>
  );
};

export default TourForm;

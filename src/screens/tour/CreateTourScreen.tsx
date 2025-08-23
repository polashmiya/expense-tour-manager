import { StyleSheet, ScrollView, TouchableOpacity, View, Modal } from 'react-native';

import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Modal, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import InputField from '../../components/InputField';
import { TourMember } from '../../types/tour';
import { useNavigation } from '@react-navigation/native';
import { addTour } from '../../storage/tourStorage';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateTourScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<TourMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const navigation = useNavigation();

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    // Generate a simple unique id for the tour
    const id = Date.now().toString();
    await addTour({
      id,
      name,
      description,
      startDate: startDate ? startDate.toISOString().slice(0, 10) : undefined,
      endDate: endDate ? endDate.toISOString().slice(0, 10) : undefined,
      createDate: new Date().toISOString(),
  members: members.filter(m => selectedMembers.includes(m.id)),
      expenses: [],
    });
    navigation.goBack();
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Create Tour</Text>
        <View style={styles.fieldGap}>
          <InputField label="Tour Name" value={name} onChangeText={setName} error={error} />
        </View>
        <View style={styles.fieldGap}>
          <InputField label="Description" value={description} onChangeText={setDescription} multiline />
        </View>
        <View style={styles.fieldGap}>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <View pointerEvents="none">
              <InputField
                label="Start Date"
                value={startDate ? startDate.toISOString().slice(0, 10) : ''}
                onChangeText={() => {}}
              />
            </View>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setStartDate(date);
              }}
            />
          )}
        </View>
        <View style={styles.fieldGap}>
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <View pointerEvents="none">
              <InputField
                label="End Date (optional)"
                value={endDate ? endDate.toISOString().slice(0, 10) : ''}
                onChangeText={() => {}}
              />
            </View>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}
        </View>
        <Button mode="outlined" onPress={() => setShowMembersModal(true)}>
          Add Members
        </Button>
        <Button mode="contained" onPress={handleCreate} style={styles.button}>
          Create
        </Button>
      </ScrollView>

      {/* Members Modal - now outside ScrollView */}
      <Modal
        visible={showMembersModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMembersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Members</Text>
              <Button
                mode="text"
                onPress={() => {
                  setShowMembersModal(false);
                  setTimeout(() => setShowAddMemberModal(true), 300);
                }}
              >
                Add New
              </Button>
            </View>
            <ScrollView style={styles.memberScrollView}>
              {members.length === 0 && (
                <Text style={styles.noMembersText}>No members yet.</Text>
              )}
              {members.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.memberOptionRow}
                  onPress={() => {
                    if (selectedMembers.includes(m.id)) {
                      setSelectedMembers(selectedMembers.filter(mid => mid !== m.id));
                    } else {
                      setSelectedMembers([...selectedMembers, m.id]);
                    }
                  }}
                >
                  <View style={styles.checkbox}>
                    {selectedMembers.includes(m.id) && <View style={styles.checkboxChecked} />}
                  </View>
                  <Text style={styles.memberOptionText}>{m.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button mode="contained" onPress={() => setShowMembersModal(false)} style={styles.modalDoneBtn}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
      {/* Add Member Modal - now outside ScrollView */}
      <Modal
        visible={showAddMemberModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Member</Text>
            <InputField
              label="Member Name"
              value={newMemberName}
              onChangeText={setNewMemberName}
            />
            <Button
              mode="contained"
              onPress={() => {
                if (newMemberName.trim()) {
                  setMembers(prev => [...prev, { id: Date.now().toString(), name: newMemberName.trim() }]);
                  setNewMemberName('');
                  setShowAddMemberModal(false);
                  setTimeout(() => setShowMembersModal(true), 300);
                }
              }}
              style={styles.addMemberModalAddBtn}
            >
              Add Member
            </Button>
            <Button onPress={() => setShowAddMemberModal(false)} style={styles.addMemberModalCancelBtn}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberScrollView: {
    maxHeight: 250,
  },
  noMembersText: {
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 12,
  },
  modalDoneBtn: {
    marginTop: 16,
  },
  addMemberModalAddBtn: {
    marginTop: 12,
  },
  addMemberModalCancelBtn: {
    marginTop: 8,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldGap: {
    marginBottom: 18,
  },
  button: {
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  membersLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  inputLike: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    backgroundColor: '#fafbfc',
    justifyContent: 'center',
  },
  inputLikePlaceholder: {
    borderColor: '#ccc',
  },
  inputLikePlaceholderText: {
    color: '#aaa',
  },
  selectedMembersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberChip: {
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  memberChipText: {
    color: '#2d3a5a',
    fontWeight: 'bold',
  },
  memberOption: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#b6c2d9',
  },
  memberOptionText: {
    color: '#3b4a6b',
  },
  memberOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#60a5fa',
    borderRadius: 6,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  addMemberBtn: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  addMemberBtnText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

export default CreateTourScreen;

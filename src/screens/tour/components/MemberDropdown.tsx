import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TourMember } from '../../../types/tour';

const MemberDropdown = ({ members, selected, onSelect }: { members: TourMember[], selected: string | null, onSelect: (id: string | null) => void }) => {
  return (
    <View style={{ marginVertical: 8 }}>
      <Text>Filter by Member:</Text>
      <Picker
        selectedValue={selected}
        onValueChange={value => onSelect(value)}
      >
        <Picker.Item label="All" value={null} />
        {members.map(m => (
          <Picker.Item key={m.id} label={m.name} value={m.id} />
        ))}
      </Picker>
    </View>
  );
};

export default MemberDropdown;

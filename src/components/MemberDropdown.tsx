import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { TourMember } from '../types/tour';

interface MemberDropdownProps {
  members: TourMember[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onAddNew: () => void;
}

const MemberDropdown: React.FC<MemberDropdownProps> = ({ members, selected, onSelect, onAddNew }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={styles.row}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setVisible(true)} style={styles.dropdownBtn}>
            {selected ? members.find(m => m.id === selected)?.name : 'Select Member'}
          </Button>
        }
      >
        <Menu.Item onPress={() => { onSelect(null); setVisible(false); }} title="All Members" />
        {members.map(m => (
          <Menu.Item key={m.id} onPress={() => { onSelect(m.id); setVisible(false); }} title={m.name} />
        ))}
      </Menu>
      <Button mode="contained" onPress={onAddNew} style={styles.addBtn}>
        Add New
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dropdownBtn: {
    flex: 1,
    marginRight: 8,
  },
  addBtn: {
    height: 40,
    justifyContent: 'center',
  },
});

export default MemberDropdown;

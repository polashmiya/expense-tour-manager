import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '../types';

const GROUP_KEY = 'groups';

export const getAllGroups = async (): Promise<Group[]> => {
  const data = await AsyncStorage.getItem(GROUP_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveGroups = async (groups: Group[]) => {
  await AsyncStorage.setItem(GROUP_KEY, JSON.stringify(groups));
};

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './screens/HomeScreen';
import GroupDetailsScreen from './screens/GroupDetailsScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';
import EditTransactionScreen from './screens/EditTransactionScreen';
import AddGroupScreen from './screens/AddGroupScreen';
import EditGroupScreen from './screens/EditGroupScreen';
import AllPersonalTransactionsScreen from './screens/AllPersonalTransactionsScreen';
import { TransactionProvider } from './context/TransactionContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => (
  <TransactionProvider>
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: true }}>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} options={{ title: 'Group Details' }} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }} />
          <Stack.Screen name="EditTransaction" component={EditTransactionScreen} options={{ title: 'Edit Transaction' }} />
          <Stack.Screen name="AddGroup" component={AddGroupScreen} options={{ title: 'Add Group' }} />
          <Stack.Screen name="EditGroup" component={EditGroupScreen} options={{ title: 'Edit Group' }} />
          <Stack.Screen name="AllPersonalTransactions" component={AllPersonalTransactionsScreen} options={{ title: 'All Personal Transactions' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </TransactionProvider>
);

export default AppNavigator;

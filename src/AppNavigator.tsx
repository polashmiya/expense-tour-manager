import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TransactionProvider } from './context/TransactionContext';
import HomeScreen from './screens/home/HomeScreen';
import TourScreen from './screens/tour/TourScreen';
import GroupDetailsScreen from './screens/home/components/GroupDetailsScreen';
import AddTransactionScreen from './screens/home/components/AddTransactionScreen';
import EditTransactionScreen from './screens/home/components/EditTransactionScreen';
import AddGroupScreen from './screens/home/components/AddGroupScreen';
import EditGroupScreen from './screens/home/components/EditGroupScreen';
import AllPersonalTransactionsScreen from './screens/home/components/AllPersonalTransactionsScreen';
import AllIncomeScreen from './screens/home/components/AllIncomeScreen';
import AllExpenseScreen from './screens/home/components/AllExpenseScreen';
import AllTransactionsScreen from './screens/home/components/AllTransactionsScreen';

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

      {/* add a another tab called Tour */}
      <Tab.Screen
        name="Tour"
        component={TourScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" color={color} size={size} />
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
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{ headerShown: true }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GroupDetails"
            component={GroupDetailsScreen}
            options={{ title: 'Group Details' }}
          />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransactionScreen}
            options={{ title: 'Add Transaction' }}
          />
          <Stack.Screen
            name="EditTransaction"
            component={EditTransactionScreen}
            options={{ title: 'Edit Transaction' }}
          />
          <Stack.Screen
            name="AddGroup"
            component={AddGroupScreen}
            options={{ title: 'Add Group' }}
          />
          <Stack.Screen
            name="EditGroup"
            component={EditGroupScreen}
            options={{ title: 'Edit Group' }}
          />
          <Stack.Screen
            name="AllPersonalTransactions"
            component={AllPersonalTransactionsScreen}
            options={{ title: 'All Personal Transactions' }}
          />
          <Stack.Screen
            name="AllIncome"
            component={AllIncomeScreen}
            options={{ title: 'All Income Transactions' }}
          />
          <Stack.Screen
            name="AllExpense"
            component={AllExpenseScreen}
            options={{ title: 'All Expense Transactions' }}
          />
          <Stack.Screen
            name="AllTransactions"
            component={AllTransactionsScreen}
            options={{ title: 'All Transactions' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </TransactionProvider>
);

export default AppNavigator;

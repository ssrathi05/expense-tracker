import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import EditTransactionScreen from "../screens/EditTransactionScreen";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 84,
          paddingTop: 8,
          paddingBottom: 18,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#2F241D",
        tabBarInactiveTintColor: "#9A8F86",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      <Stack.Screen name="EditTransaction" component={EditTransactionScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F7F2EA",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <LoginScreen />}
    </NavigationContainer>
  );
}
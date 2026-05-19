import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import { getTransactions } from "../services/transactionService";

function getCategoryTotals(transactions) {
  const totals = {};

  transactions.forEach((item) => {
    const category = item.category || "Other";
    totals[category] = (totals[category] || 0) + Number(item.amount);
  });

  return Object.entries(totals)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}

export default function CategoriesScreen() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    try {
      setLoading(true);
      const transactions = await getTransactions(user.uid);
      setCategories(getCategoryTotals(transactions));
    } catch (error) {
      Alert.alert("Error loading categories", error.message);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadCategories();
      }
    }, [user])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Categories</Text>
        <Text style={styles.subtitle}>Spending by category</Text>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 20, paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No spending yet. Add a transaction to see category totals here.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.categoryCard}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryTotal}>
                ${item.total.toFixed(2)}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

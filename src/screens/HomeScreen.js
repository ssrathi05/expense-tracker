import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import { addTransaction, getTransactions } from "../services/transactionService";

function getTopCategory(transactions) {
  if (transactions.length === 0) {
    return "None";
  }

  const totalsByCategory = {};

  transactions.forEach((item) => {
    const category = item.category || "Other";
    totalsByCategory[category] =
      (totalsByCategory[category] || 0) + Number(item.amount);
  });

  return Object.entries(totalsByCategory).sort((a, b) => b[1] - a[1])[0][0];
}

const sampleTransactions = [
  {
    merchant: "Starbucks",
    amount: 6.42,
    category: "Coffee",
    date: "May 19",
    emoji: "☕",
  },
  {
    merchant: "Target",
    amount: 38.21,
    category: "Shopping",
    date: "May 18",
    emoji: "🛍️",
  },
  {
    merchant: "Chipotle",
    amount: 12.75,
    category: "Food",
    date: "May 17",
    emoji: "🌯",
  },
  {
    merchant: "Spotify",
    amount: 10.99,
    category: "Subscriptions",
    date: "May 15",
    emoji: "🎧",
  },
];

export default function HomeScreen() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalSpent = transactions.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const topCategory = getTopCategory(transactions);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await getTransactions(user.uid);
      setTransactions(data);
    } catch (error) {
      Alert.alert("Error loading transactions", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function addSampleTransactions() {
    try {
      for (const transaction of sampleTransactions) {
        await addTransaction(user.uid, transaction);
      }

      await loadTransactions();
    } catch (error) {
      Alert.alert("Error adding transactions", error.message);
    }
  }

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi Shreya</Text>
          <Text style={styles.subtitle}>Your spending at a glance</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.cardLabel}>Spent this month</Text>
          <Text style={styles.totalAmount}>${totalSpent.toFixed(2)}</Text>
          <Text style={styles.cardSmallText}>From your saved activity</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>{transactions.length}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Top Category</Text>
            <Text style={styles.statValue}>{topCategory}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={addSampleTransactions}>
            <Text style={styles.seeAll}>Add sample</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No transactions yet. Tap “Add sample” to test Firestore.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>{item.emoji}</Text>
                </View>

                <View>
                  <Text style={styles.merchant}>{item.merchant}</Text>
                  <Text style={styles.transactionDetails}>
                    {item.category} • {item.date}
                  </Text>
                </View>
              </View>

              <Text style={styles.amount}>
                -${Number(item.amount).toFixed(2)}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Connect Bank Later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
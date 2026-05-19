import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import {
  getTransactions,
  deleteTransaction,
} from "../services/transactionService";

export default function TransactionsScreen({ navigation }) {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const swipeableRefs = useRef({});

  const stackNavigation = navigation.getParent();

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

  function closeOtherSwipeables(openId) {
    Object.entries(swipeableRefs.current).forEach(([id, ref]) => {
      if (id !== openId) {
        ref?.close();
      }
    });
  }

  function confirmDelete(transactionId) {
    swipeableRefs.current[transactionId]?.close();

    Alert.alert(
      "Delete transaction?",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(user.uid, transactionId);
              await loadTransactions();
            } catch (error) {
              Alert.alert("Error deleting transaction", error.message);
            }
          },
        },
      ]
    );
  }

  function renderRightActions(transactionId) {
    return (
      <TouchableOpacity
        style={styles.swipeDeleteAction}
        onPress={() => confirmDelete(transactionId)}
        activeOpacity={0.85}
      >
        <Text style={styles.swipeDeleteText}>Delete</Text>
      </TouchableOpacity>
    );
  }

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadTransactions();
      }
    }, [user])
  );

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
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Transactions</Text>
            <Text style={styles.subtitle}>Swipe left to delete</Text>
          </View>

          <TouchableOpacity
            style={styles.addSmallButton}
            onPress={() => stackNavigation?.navigate("AddTransaction")}
          >
            <Text style={styles.addSmallButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 20, paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No transactions yet. Tap the + button to add one.
            </Text>
          }
          renderItem={({ item }) => (
            <Swipeable
              ref={(ref) => {
                swipeableRefs.current[item.id] = ref;
              }}
              renderRightActions={() => renderRightActions(item.id)}
              overshootRight={false}
              friction={2}
              onSwipeableWillOpen={() => closeOtherSwipeables(item.id)}
            >
              <TouchableOpacity
                style={styles.transactionCard}
                activeOpacity={0.7}
                onPress={() =>
                  stackNavigation?.navigate("EditTransaction", {
                    transaction: item,
                  })
                }
              >
                <View style={styles.transactionLeft}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>{item.emoji}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.merchant}>{item.merchant}</Text>
                    <Text style={styles.transactionDetails}>
                      {item.category} • {item.date}
                    </Text>
                  </View>
                </View>

                <Text style={styles.amount}>
                  -${Number(item.amount).toFixed(2)}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

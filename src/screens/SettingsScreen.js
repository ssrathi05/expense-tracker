import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";


import { getPlaidTransactions } from "../services/plaidService";
import { addPlaidTransaction } from "../services/transactionService";

export default function SettingsScreen({ navigation }) {
  const { logOut, user } = useAuth();

  async function handleImportBankTransactions() {
    try {
      const data = await getPlaidTransactions();

      if (!data.added || data.added.length === 0) {
        Alert.alert("No transactions", "No new bank transactions found.");
        return;
      }

      let imported = 0;
      let skipped = 0;

      for (const transaction of data.added) {
        const result = await addPlaidTransaction(user.uid, transaction);
        if (result === "imported") {
          imported += 1;
        } else {
          skipped += 1;
        }
      }

      Alert.alert(
        "Import complete",
        `${imported} transaction${imported === 1 ? "" : "s"} imported. ${skipped} skipped (already saved).`
      );
    } catch (error) {
      Alert.alert("Import error", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences</Text>

        <View style={{ marginTop: 20 }}>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Signed in as</Text>
            <Text style={styles.categoryArrow}>{user?.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.getParent()?.navigate("ConnectBank")}
          >
            <Text style={styles.categoryName}>Connect Bank</Text>
            <Text style={styles.categoryArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={handleImportBankTransactions}
          >
            <Text style={styles.categoryName}>Import Bank Transactions</Text>
            <Text style={styles.categoryArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Export to CSV</Text>
            <Text style={styles.categoryArrow}>›</Text>
          </View>

          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Budget Goals</Text>
            <Text style={styles.categoryArrow}>›</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
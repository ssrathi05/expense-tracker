import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import { addTransaction } from "../services/transactionService";

export default function AddTransactionScreen({ navigation }) {
  const { user } = useAuth();

  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("💸");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!merchant || !amount || !category || !date) {
      Alert.alert("Missing info", "Please fill out all fields.");
      return;
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      Alert.alert("Invalid amount", "Please enter a valid number.");
      return;
    }

    try {
      setLoading(true);

      await addTransaction(user.uid, {
        merchant: merchant.trim(),
        amount: numericAmount,
        category: category.trim(),
        date: date.trim(),
        emoji: emoji.trim() || "💸",
      });

      Alert.alert("Saved", "Transaction added successfully.");

      setMerchant("");
      setAmount("");
      setCategory("");
      setDate("");
      setEmoji("💸");

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error saving transaction", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Add Transaction</Text>
        <Text style={styles.subtitle}>Manually enter an expense</Text>

        <View style={styles.authCard}>
          <Text style={styles.inputLabel}>Merchant</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: Starbucks"
            placeholderTextColor="#A8A099"
            value={merchant}
            onChangeText={setMerchant}
          />

          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: 6.42"
            placeholderTextColor="#A8A099"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text style={styles.inputLabel}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: Coffee"
            placeholderTextColor="#A8A099"
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.inputLabel}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: May 19"
            placeholderTextColor="#A8A099"
            value={date}
            onChangeText={setDate}
          />

          <Text style={styles.inputLabel}>Emoji</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: ☕"
            placeholderTextColor="#A8A099"
            value={emoji}
            onChangeText={setEmoji}
          />

          {loading ? (
            <ActivityIndicator style={{ marginTop: 18 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Transaction</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
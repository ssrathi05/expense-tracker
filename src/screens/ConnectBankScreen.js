import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { create, open } from "react-native-plaid-link-sdk";

import { styles } from "../styles/globalStyles";
import { createLinkToken, exchangePublicToken } from "../services/plaidService";

export default function ConnectBankScreen({ navigation }) {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCreateLinkToken() {
    try {
      setLoading(true);

      const data = await createLinkToken();

      if (!data.link_token) {
        Alert.alert("Plaid error", "No link token was returned.");
        return;
      }

      setLinkToken(data.link_token);

      create({
        token: data.link_token,
      });

      Alert.alert("Ready", "Plaid is ready. Tap Open Plaid.");
    } catch (error) {
      console.log("Create link token error:", error);
      Alert.alert("Plaid error", error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenPlaid() {
    console.log("Open Plaid pressed");

    try {
      open({
        onSuccess: async (success) => {
          console.log("Plaid success:", success);

          try {
            await exchangePublicToken(success.publicToken);
            Alert.alert("Bank connected", "Your bank was connected successfully.");
            navigation.goBack();
          } catch (error) {
            console.log("Token exchange error:", error);
            Alert.alert("Token exchange error", error.message);
          }
        },
        onExit: (exit) => {
          console.log("Plaid exited:", exit);
        },
      });
    } catch (error) {
      console.log("Open Plaid error:", error);
      Alert.alert("Open Plaid error", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Connect Bank</Text>
        <Text style={styles.subtitle}>
          Connect your bank account to import debit transactions.
        </Text>

        <View style={styles.authCard}>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : !linkToken ? (
            <TouchableOpacity style={styles.button} onPress={handleCreateLinkToken}>
              <Text style={styles.buttonText}>Start Bank Connection</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleOpenPlaid}>
              <Text style={styles.buttonText}>Open Plaid</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
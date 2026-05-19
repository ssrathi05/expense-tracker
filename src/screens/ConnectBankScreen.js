import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlaidLink } from "react-native-plaid-link-sdk";

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
      Alert.alert("Ready", "Plaid link token created. Tap Open Plaid.");
    } catch (error) {
      Alert.alert("Plaid error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSuccess(success) {
    try {
      await exchangePublicToken(success.publicToken);
      Alert.alert("Bank connected", "Your bank was connected successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Token exchange error", error.message);
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
            <PlaidLink
              tokenConfig={{
                token: linkToken,
              }}
              onSuccess={handleSuccess}
              onExit={(exit) => {
                console.log("Plaid exited:", exit);
              }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Open Plaid</Text>
              </View>
            </PlaidLink>
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
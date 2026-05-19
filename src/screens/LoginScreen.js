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

import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/globalStyles";

export default function LoginScreen() {
  const { signUp, logIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password);
    } catch (error) {
      Alert.alert("Sign up error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await logIn(email.trim(), password);
    } catch (error) {
      Alert.alert("Login error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to track your spending</Text>

        <View style={styles.authCard}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#A8A099"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A8A099"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {loading ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSignUp}
              >
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
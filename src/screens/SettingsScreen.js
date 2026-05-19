import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen({ navigation }) {
  const { logOut, user } = useAuth();

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
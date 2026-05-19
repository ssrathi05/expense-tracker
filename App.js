import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const transactions = [
  {
    id: "1",
    merchant: "Starbucks",
    amount: 6.42,
    category: "Coffee",
    date: "May 19",
    emoji: "☕",
  },
  {
    id: "2",
    merchant: "Target",
    amount: 38.21,
    category: "Shopping",
    date: "May 18",
    emoji: "🛍️",
  },
  {
    id: "3",
    merchant: "Chipotle",
    amount: 12.75,
    category: "Food",
    date: "May 17",
    emoji: "🌯",
  },
  {
    id: "4",
    merchant: "Spotify",
    amount: 10.99,
    category: "Subscriptions",
    date: "May 15",
    emoji: "🎧",
  },
];

function HomeScreen() {
  const totalSpent = transactions.reduce((sum, item) => sum + item.amount, 0);

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
          <Text style={styles.cardSmallText}>From your recent activity</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Top Category</Text>
            <Text style={styles.statValue}>Food</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Subscriptions</Text>
            <Text style={styles.statValue}>$10.99</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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

              <Text style={styles.amount}>-${item.amount.toFixed(2)}</Text>
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

function TransactionsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Transactions</Text>
        <Text style={styles.subtitle}>All your recent spending</Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 20 }}
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

              <Text style={styles.amount}>-${item.amount.toFixed(2)}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function CategoriesScreen() {
  const categories = ["Coffee", "Shopping", "Food", "Subscriptions", "Gas", "School"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Categories</Text>
        <Text style={styles.subtitle}>Organize your spending</Text>

        <View style={{ marginTop: 20 }}>
          {categories.map((category) => (
            <View key={category} style={styles.categoryCard}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences</Text>

        <View style={{ marginTop: 20 }}>
          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Connect Bank</Text>
            <Text style={styles.categoryArrow}>›</Text>
          </View>

          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Export to CSV</Text>
            <Text style={styles.categoryArrow}>›</Text>
          </View>

          <View style={styles.categoryCard}>
            <Text style={styles.categoryName}>Budget Goals</Text>
            <Text style={styles.categoryArrow}>›</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F2EA",
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 18,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "800",
    color: "#211A16",
  },
  subtitle: {
    fontSize: 15,
    color: "#7A6F66",
    marginTop: 5,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#211A16",
  },
  balanceCard: {
    backgroundColor: "#2F241D",
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 15,
    color: "#E8DCCF",
  },
  totalAmount: {
    fontSize: 44,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 8,
  },
  cardSmallText: {
    fontSize: 13,
    color: "#D6C7B8",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    fontSize: 13,
    color: "#8A8178",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2F241D",
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#211A16",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8B5E3C",
  },
  listContent: {
    paddingBottom: 18,
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1E7DA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  merchant: {
    fontSize: 16,
    fontWeight: "800",
    color: "#211A16",
  },
  transactionDetails: {
    fontSize: 13,
    color: "#8A8178",
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#B45309",
  },
  button: {
    backgroundColor: "#2F241D",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#211A16",
  },
  categoryArrow: {
    fontSize: 28,
    color: "#8A8178",
  },
});
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, List, Divider, Button, PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("✅ AsyncStorage cleared successfully.");
    } catch (error) {
      console.error("❌ Failed to clear AsyncStorage:", error);
    }
  };
  const handleResetData = async () => {
    await clearAllStorage();
    if (typeof window !== "undefined" && window.location) {
      window.location.reload();
    }
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Allgemein */}
        <List.Section>
          <List.Subheader style={styles.subheader}>Allgemein</List.Subheader>
          <List.Item
            title="Benachrichtigungen"
            left={() => <List.Icon icon="bell" />}
          />
          <List.Item
            title="Sprache"
            left={() => <List.Icon icon="translate" />}
          />
        </List.Section>
        <Divider />

        {/* Daten */}
        <List.Section>
          <List.Subheader style={styles.subheader}>Daten</List.Subheader>
          <List.Item
            title="Speicherort anzeigen"
            left={() => <List.Icon icon="database" />}
          />
          <List.Item
            title="Backup erstellen"
            left={() => <List.Icon icon="backup-restore" />}
          />
        </List.Section>
        <Divider />

        {/* Design */}
        <List.Section>
          <List.Subheader style={styles.subheader}>Design</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={() => <List.Icon icon="theme-light-dark" />}
          />
          <List.Item
            title="Schriftgröße"
            left={() => <List.Icon icon="format-size" />}
          />
        </List.Section>
        <Divider />

        {/* Reset */}
        <View style={styles.resetContainer}>
          <Button
            mode="contained"
            onPress={handleResetData}
            buttonColor="#e53935"
            textColor="#fff"
          >
            Daten zurücksetzen
          </Button>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#25292e",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 16,
    fontWeight: "bold",
  },
  subheader: {
    color: "#aaa",
  },
  resetContainer: {
    marginTop: 32,
    alignItems: "center",
  },
});

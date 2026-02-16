import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Empezar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#4A90D9",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

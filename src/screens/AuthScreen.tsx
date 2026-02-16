import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export default function AuthScreen() {
  const { signIn, isLoading } = useGoogleAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>books-mb</Text>
      <Text style={styles.subtitle}>Lectura competitiva</Text>
      <TouchableOpacity style={styles.button} onPress={signIn} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar con Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  button: { backgroundColor: '#4285F4', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8, minWidth: 220, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

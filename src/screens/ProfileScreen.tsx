import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../hooks/useAuthStore';
import UserAvatar from '../components/UserAvatar';
import StatCard from '../components/StatCard';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserAvatar
          avatarUrl={user?.avatarUrl ?? null}
          displayName={user?.displayName ?? 'U'}
          size={80}
        />
        <Text style={styles.name}>{user?.displayName ?? 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </View>

      <View style={styles.stats}>
        <StatCard label="Puntos" value={user?.totalPoints ?? 0} />
        <StatCard label="Libros" value={user?.booksCompleted ?? 0} />
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={clearAuth}>
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  stats: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 40, paddingHorizontal: 20 },
  signOutButton: {
    alignSelf: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  signOutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

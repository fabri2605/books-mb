import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuthStore } from '../hooks/useAuthStore';
import LeaderboardRow from '../components/LeaderboardRow';

export default function LeaderboardScreen() {
  const { entries, loading } = useLeaderboard();
  const userId = useAuthStore((s) => s.user?.id);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking Mundial</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <LeaderboardRow entry={item} isCurrentUser={item.userId === userId} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 16 },
  separator: { height: 1, backgroundColor: '#f0f0f0' },
});

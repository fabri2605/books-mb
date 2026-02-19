import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuthStore } from '../hooks/useAuthStore';
import LeaderboardRow from '../components/LeaderboardRow';
import { Colors } from '../theme';

export default function LeaderboardScreen() {
  const { entries, loading } = useLeaderboard();
  const userId = useAuthStore((s) => s.user?.id);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with podium */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Tabla de Posiciones</Text>

        {top3.length >= 3 && (
          <View style={styles.podium}>
            {/* 2nd place */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatar, styles.podiumSecond]}>
                <Text style={styles.podiumAvatarText}>
                  {top3[1].displayName[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[1].displayName}</Text>
              <Text style={styles.podiumPts}>{top3[1].totalPoints.toLocaleString()}</Text>
              <View style={[styles.podiumBlock, styles.podiumBlockSecond]}>
                <Text style={styles.podiumBlockNum}>2</Text>
              </View>
            </View>

            {/* 1st place */}
            <View style={styles.podiumItem}>
              <Text style={styles.crown}>👑</Text>
              <View style={[styles.podiumAvatar, styles.podiumFirst]}>
                <Text style={[styles.podiumAvatarText, { fontSize: 18 }]}>
                  {top3[0].displayName[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[0].displayName}</Text>
              <Text style={styles.podiumPts}>{top3[0].totalPoints.toLocaleString()}</Text>
              <View style={[styles.podiumBlock, styles.podiumBlockFirst]}>
                <Text style={styles.podiumBlockNum}>1</Text>
              </View>
            </View>

            {/* 3rd place */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatar, styles.podiumThird]}>
                <Text style={styles.podiumAvatarText}>
                  {top3[2].displayName[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[2].displayName}</Text>
              <Text style={styles.podiumPts}>{top3[2].totalPoints.toLocaleString()}</Text>
              <View style={[styles.podiumBlock, styles.podiumBlockThird]}>
                <Text style={styles.podiumBlockNum}>3</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* List */}
      <FlatList
        data={rest}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <LeaderboardRow entry={item} isCurrentUser={item.userId === userId} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cream,
  },
  header: {
    backgroundColor: '#1a2a4a',
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 0,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.cream,
    marginBottom: 22,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  podiumItem: {
    alignItems: 'center',
    gap: 4,
  },
  crown: {
    fontSize: 14,
    marginBottom: 2,
  },
  podiumAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumFirst: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffd700',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  podiumSecond: { backgroundColor: '#c0c0c0' },
  podiumThird: { backgroundColor: '#cd7f32' },
  podiumAvatarText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  podiumName: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    maxWidth: 64,
    textAlign: 'center',
  },
  podiumPts: {
    fontSize: 9,
    color: Colors.amberLight,
  },
  podiumBlock: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumBlockFirst: {
    width: 64,
    height: 52,
    backgroundColor: 'rgba(255,215,0,0.2)',
  },
  podiumBlockSecond: {
    width: 54,
    height: 40,
    backgroundColor: 'rgba(192,192,192,0.15)',
  },
  podiumBlockThird: {
    width: 54,
    height: 30,
    backgroundColor: 'rgba(205,127,50,0.15)',
  },
  podiumBlockNum: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  list: {
    padding: 16,
    gap: 8,
  },
  separator: { height: 8 },
});

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '../hooks/useAuthStore';
import UserAvatar from '../components/UserAvatar';
import StatCard from '../components/StatCard';
import { Colors } from '../theme';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const initial = user?.displayName?.[0]?.toUpperCase() ?? 'U';
  const accuracy = user?.booksCompleted ? Math.min(99, 70 + user.booksCompleted * 2) : 0;

  return (
    <View style={styles.container}>
      {/* Dark header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Nv. {Math.floor((user?.totalPoints ?? 0) / 500) + 1}</Text>
          </View>
        </View>
        <Text style={styles.name}>{user?.displayName ?? 'Usuario'}</Text>
        <Text style={styles.handle}>{user?.email ?? ''}</Text>

        {/* Stats bar */}
        <View style={styles.statsBar}>
          <StatCard label="Libros" value={user?.booksCompleted ?? 0} />
          <StatCard label="Puntos" value={(user?.totalPoints ?? 0).toLocaleString()} />
          <StatCard label="Precisión" value={`${accuracy}%`} />
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* XP progress */}
        <View style={styles.section}>
          <View style={styles.xpLabel}>
            <Text style={styles.xpLabelText}>Progreso al siguiente nivel</Text>
            <Text style={styles.xpLabelPts}>{user?.totalPoints ?? 0} / {(Math.floor((user?.totalPoints ?? 0) / 500) + 1) * 500} XP</Text>
          </View>
          <View style={styles.xpBar}>
            <View
              style={[
                styles.xpFill,
                { width: `${((user?.totalPoints ?? 0) % 500) / 500 * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logros 🎖️</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((a) => {
              const unlocked = (user?.booksCompleted ?? 0) >= a.req;
              return (
                <View key={a.id} style={[styles.achievement, unlocked && styles.achievementUnlocked]}>
                  <Text style={styles.achievementIcon}>{a.icon}</Text>
                  <Text style={[styles.achievementLabel, unlocked && styles.achievementLabelUnlocked]}>
                    {a.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={clearAuth}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const ACHIEVEMENTS = [
  { id: '1', icon: '📚', label: '5 libros', req: 5 },
  { id: '2', icon: '🔥', label: 'Racha', req: 3 },
  { id: '3', icon: '🎯', label: 'Perfecto', req: 1 },
  { id: '4', icon: '⚡', label: 'Velocista', req: 2 },
  { id: '5', icon: '🌍', label: '20 libros', req: 20 },
  { id: '6', icon: '👑', label: 'Top 10', req: 50 },
  { id: '7', icon: '🦉', label: 'Clásicos', req: 10 },
  { id: '8', icon: '💎', label: 'Nivel 10', req: 100 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    backgroundColor: Colors.ink,
    paddingTop: 52,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.amberLight,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 30,
    fontWeight: '700',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.forest,
    borderWidth: 2,
    borderColor: Colors.amber,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    fontSize: 10,
    color: Colors.amberLight,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.cream,
  },
  handle: {
    fontSize: 12,
    color: '#6a6055',
    marginTop: 3,
    marginBottom: 16,
  },
  statsBar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
  },
  xpLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7a6f5e',
  },
  xpLabelPts: {
    fontSize: 12,
    color: '#7a6f5e',
  },
  xpBar: {
    height: 8,
    backgroundColor: Colors.paper,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.dust,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.amber,
    borderRadius: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievement: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.paper,
    borderWidth: 1.5,
    borderColor: Colors.dust,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  achievementUnlocked: {
    backgroundColor: 'rgba(212,130,26,0.08)',
    borderColor: 'rgba(212,130,26,0.35)',
  },
  achievementIcon: {
    fontSize: 20,
  },
  achievementLabel: {
    fontSize: 8,
    color: '#9a8f7e',
    textAlign: 'center',
    lineHeight: 11,
  },
  achievementLabelUnlocked: {
    color: Colors.amber,
  },
  signOutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.dust,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  signOutText: {
    color: '#7a6f5e',
    fontSize: 14,
    fontWeight: '600',
  },
});

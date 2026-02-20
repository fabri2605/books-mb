import { StyleSheet, Text, View } from 'react-native';
import { LeaderboardEntry } from '../types';
import { Colors, Fonts } from '../theme';

interface Props {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

// Deterministic color from name for avatar
const AVATAR_COLORS = [
  '#6a4aad', '#0f4c81', '#2e7d32', '#b71c1c',
  '#c08050', '#1a6a5a', '#7a3010', '#1a3a7a',
];

function avatarColor(name: string): string {
  let h = 5381;
  for (let i = 0; i < name.length; i++) {
    h = (Math.imul(33, h) ^ name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default function LeaderboardRow({ entry, isCurrentUser }: Props) {
  const isTop4 = entry.rank <= 4;

  return (
    <View style={[styles.row, isCurrentUser && styles.rowMe]}>
      <Text style={[styles.rank, isTop4 && styles.rankTop]}>
        {entry.rank}
      </Text>
      <View style={[styles.avatar, { backgroundColor: avatarColor(entry.displayName) }]}>
        <Text style={styles.avatarText}>
          {entry.displayName[0].toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{entry.displayName}</Text>
          {isCurrentUser && (
            <Text style={styles.youTag}>★ Vos</Text>
          )}
        </View>
        <Text style={styles.books}>{entry.booksCompleted} libros leídos</Text>
      </View>
      <Text style={[styles.points, isCurrentUser && styles.pointsMe]}>
        {entry.totalPoints.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 12,
  },
  rowMe: {
    backgroundColor: 'rgba(201,122,26,0.07)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.amber,
  },
  rank: {
    width: 22,
    textAlign: 'center',
    fontFamily: Fonts.playfairBold,
    fontSize: 13,
    color: '#b0a080',
  },
  rankTop: {
    color: Colors.amber,
    fontSize: 15,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1410',
  },
  youTag: {
    fontSize: 11,
    color: Colors.amber,
    fontWeight: '600',
  },
  books: {
    fontSize: 11,
    color: '#a09080',
    marginTop: 1,
  },
  points: {
    fontFamily: Fonts.playfairBold,
    fontSize: 16,
    color: Colors.amber,
  },
  pointsMe: {
    color: Colors.amber,
  },
});

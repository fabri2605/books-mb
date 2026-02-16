import { StyleSheet, Text, View } from 'react-native';
import { LeaderboardEntry } from '../types';
import UserAvatar from './UserAvatar';

interface Props {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

const RANK_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export default function LeaderboardRow({ entry, isCurrentUser }: Props) {
  return (
    <View style={[styles.row, isCurrentUser && styles.currentUser]}>
      <Text style={[styles.rank, { color: RANK_COLORS[entry.rank] ?? '#666' }]}>
        #{entry.rank}
      </Text>
      <UserAvatar avatarUrl={entry.avatarUrl} displayName={entry.displayName} size={40} />
      <View style={styles.info}>
        <Text style={styles.name}>{entry.displayName}</Text>
        <Text style={styles.books}>{entry.booksCompleted} libros</Text>
      </View>
      <Text style={styles.points}>{entry.totalPoints} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  currentUser: { backgroundColor: '#EBF5FF' },
  rank: { fontSize: 16, fontWeight: '700', width: 36 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  books: { fontSize: 12, color: '#999' },
  points: { fontSize: 16, fontWeight: '700', color: '#4A90D9' },
});

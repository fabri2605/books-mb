import { StyleSheet, Text, View } from 'react-native';
import { LeaderboardEntry } from '../types';
import UserAvatar from './UserAvatar';
import { Colors } from '../theme';

interface Props {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

const AVATAR_BG: Record<number, string> = {
  1: '#ffd700',
  2: '#c0c0c0',
  3: '#cd7f32',
};

export default function LeaderboardRow({ entry, isCurrentUser }: Props) {
  const isTop3 = entry.rank <= 3;
  const rankColor = isTop3 ? Colors.amber : Colors.dust;

  return (
    <View style={[styles.row, isCurrentUser && styles.rowMe]}>
      <Text style={[styles.rank, isTop3 && styles.rankTop]}>
        {entry.rank}
      </Text>
      <View style={[styles.avatarWrap, isTop3 && { backgroundColor: AVATAR_BG[entry.rank] ?? Colors.amber }]}>
        <UserAvatar
          avatarUrl={entry.avatarUrl}
          displayName={entry.displayName}
          size={34}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {entry.displayName}{isCurrentUser ? ' (Vos)' : ''}
        </Text>
        <Text style={styles.books}>{entry.booksCompleted} libros leídos</Text>
      </View>
      <Text style={styles.points}>{entry.totalPoints.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 10,
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  rowMe: {
    backgroundColor: 'rgba(212,130,26,0.07)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,130,26,0.3)',
  },
  rank: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dust,
    width: 22,
    textAlign: 'center',
  },
  rankTop: {
    color: Colors.amber,
  },
  avatarWrap: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  info: { flex: 1 },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ink,
  },
  books: {
    fontSize: 11,
    color: '#9a8f7e',
    marginTop: 1,
  },
  points: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.amber,
  },
});

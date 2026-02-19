import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Book } from '../types';
import DifficultyBadge from './DifficultyBadge';
import { Colors, coverColor } from '../theme';
import { POINTS_PER_CORRECT } from '../utils/scoring';

interface Props {
  book: Book;
  onPress: () => void;
  index?: number;
}

export default function BookCard({ book, onPress, index = 0 }: Props) {
  const pts = POINTS_PER_CORRECT[book.difficulty];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.cover, { backgroundColor: coverColor(index) }]}>
        <Text style={styles.coverTitle} numberOfLines={3}>{book.title}</Text>
        <Text style={styles.coverAuthor} numberOfLines={1}>{book.author}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      <View style={styles.meta}>
        <DifficultyBadge difficulty={book.difficulty} />
        <Text style={styles.pts}>{pts * 10} pts</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  cover: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
    padding: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  coverTitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    marginBottom: 4,
  },
  coverAuthor: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ink,
    lineHeight: 16,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pts: {
    fontSize: 10,
    color: Colors.sage,
    fontWeight: '600',
  },
});

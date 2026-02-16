import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Book } from '../types';
import DifficultyBadge from './DifficultyBadge';

interface Props {
  book: Book;
  onPress: () => void;
}

export default function BookCard({ book, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cover}>
        <Text style={styles.coverText}>{book.title[0]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <DifficultyBadge difficulty={book.difficulty} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cover: {
    width: 60,
    height: 80,
    backgroundColor: '#4A90D9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coverText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  info: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  author: { fontSize: 13, color: '#666', marginBottom: 8 },
});

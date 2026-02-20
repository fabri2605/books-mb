import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Book } from '../types';
import DifficultyBadge from './DifficultyBadge';
import ProceduralCover from './ProceduralCover';
import { Colors, coverColor } from '../theme';
import { POINTS_PER_CORRECT } from '../utils/scoring';

interface Props {
  book: Book;
  onPress: () => void;
  index?: number;
  importing?: boolean;
}

export default function BookCard({ book, onPress, index = 0, importing = false }: Props) {
  const pts = POINTS_PER_CORRECT[book.difficulty] * (book.questionCount ?? 10);
  const hasCover = !!book.coverUrl;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85} disabled={importing}>
      <View style={[styles.cover, !hasCover && { backgroundColor: coverColor(index) }]}>
        {hasCover && (
          <Image source={{ uri: book.coverUrl! }} style={StyleSheet.absoluteFillObject} resizeMode="cover" blurRadius={2} />
        )}
        {!hasCover && (
          <ProceduralCover title={book.title} author={book.author} colorIndex={index} />
        )}
        {importing && (
          <View style={styles.importingOverlay}>
            <ActivityIndicator color="rgba(255,255,255,0.8)" />
          </View>
        )}
        {book.isExternal && !importing && (
          <View style={styles.externalBadge}>
            <Text style={styles.externalBadgeText}>🌐</Text>
          </View>
        )}
        {(book.readerCount ?? 0) > 0 && !importing && (
          <View style={styles.readerBadge}>
            <Text style={styles.readerBadgeText}>👤 {book.readerCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      <View style={styles.meta}>
        <DifficultyBadge difficulty={book.difficulty} />
        <Text style={styles.pts}>{pts} pts</Text>
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
    aspectRatio: 2 / 3,
    borderRadius: 8,
    marginBottom: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  importingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2a2018',
    lineHeight: 14,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  pts: {
    fontSize: 10,
    color: Colors.sage,
    fontWeight: '600',
  },
  externalBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  externalBadgeText: {
    fontSize: 11,
  },
  readerBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  readerBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
});

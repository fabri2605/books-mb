import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Book } from '../types';
import DifficultyBadge from './DifficultyBadge';
import ProceduralCover from './ProceduralCover';
import { Colors, coverColor } from '../theme';
import { POINTS_PER_CORRECT } from '../utils/scoring';

interface Props {
  book: Book;
  onPress: () => void;
  index?: number;
}

export default function TrendingCard({ book, onPress, index = 0 }: Props) {
  const hasCover = !!book.coverUrl;
  const pts = POINTS_PER_CORRECT[book.difficulty] * (book.questionCount ?? 10);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.cover, !hasCover && { backgroundColor: coverColor(index) }]}>
        {hasCover && (
          <Image source={{ uri: book.coverUrl! }} style={StyleSheet.absoluteFillObject} resizeMode="cover" blurRadius={2} />
        )}
        {!hasCover && (
          <ProceduralCover title={book.title} author={book.author} colorIndex={index} />
        )}
        {/* Title overlay at bottom */}
        <View style={styles.coverInner}>
          <Text style={styles.coverTitle} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.coverAuthor} numberOfLines={1}>{book.author}</Text>
        </View>
        {/* Reader count badge — top right */}
        {(book.readerCount ?? 0) > 0 && (
          <View style={styles.readerBadge}>
            <Text style={styles.readerBadgeText}>👤 {book.readerCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      <View style={styles.diffRow}>
        <DifficultyBadge difficulty={book.difficulty} />
        <Text style={styles.pts}>{pts} pts</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
  },
  cover: {
    width: 110,
    height: 155,
    borderRadius: 10,
    marginBottom: 7,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
  coverInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  coverTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
  coverAuthor: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 8,
    marginTop: 2,
  },
  readerBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  readerBadgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '700',
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1410',
    lineHeight: 14,
    marginBottom: 4,
  },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  pts: {
    fontSize: 9,
    color: Colors.sage,
    fontWeight: '600',
  },
});

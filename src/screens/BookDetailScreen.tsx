import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { RootStackParamList, Book } from '../types';
import { bookService } from '../services';
import { POINTS_PER_CORRECT } from '../utils/scoring';
import DifficultyBadge from '../components/DifficultyBadge';
import { Colors, coverColor } from '../theme';

type RouteProps = NativeStackScreenProps<RootStackParamList, 'BookDetail'>['route'];
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function BookDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookService.getBookById(route.params.bookId).then((b) => {
      setBook(b);
      setLoading(false);
    });
  }, [route.params.bookId]);

  if (loading || !book) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
      </View>
    );
  }

  const pointsPerQuestion = POINTS_PER_CORRECT[book.difficulty];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cover */}
      <View style={[styles.cover, { backgroundColor: coverColor(book.id.charCodeAt(0) % 8) }]}>
        <Text style={styles.coverTitle}>{book.title}</Text>
        <Text style={styles.coverAuthor}>{book.author}</Text>
      </View>

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>

        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={book.difficulty} />
          <Text style={styles.pages}>{book.pageCount} págs.</Text>
          <Text style={styles.ptsTag}>{pointsPerQuestion * 10} pts/quiz</Text>
        </View>

        <Text style={styles.description}>{book.description}</Text>

        <TouchableOpacity
          style={styles.quizButton}
          onPress={() => navigation.navigate('Quiz', { bookId: book.id })}
          activeOpacity={0.85}
        >
          <Text style={styles.quizButtonText}>Empezar Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    paddingBottom: 32,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cream,
  },
  cover: {
    height: 260,
    justifyContent: 'flex-end',
    padding: 24,
  },
  coverTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 4,
  },
  coverAuthor: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.ink,
  },
  author: {
    fontSize: 15,
    color: '#7a6f5e',
    marginTop: -6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pages: {
    fontSize: 12,
    color: '#9a8f7e',
  },
  ptsTag: {
    fontSize: 12,
    color: Colors.amber,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#5a4f3e',
    lineHeight: 22,
  },
  quizButton: {
    backgroundColor: Colors.amber,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  quizButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

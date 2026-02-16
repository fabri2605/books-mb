import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { RootStackParamList, Book } from '../types';
import { bookService } from '../services';
import { POINTS_PER_CORRECT } from '../utils/scoring';
import DifficultyBadge from '../components/DifficultyBadge';

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
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  const pointsPerQuestion = POINTS_PER_CORRECT[book.difficulty];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.coverPlaceholder}>
        <Text style={styles.coverLetter}>{book.title[0]}</Text>
      </View>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>
      <View style={styles.metaRow}>
        <DifficultyBadge difficulty={book.difficulty} />
        <Text style={styles.pages}>{book.pageCount} páginas</Text>
      </View>
      <Text style={styles.points}>
        {pointsPerQuestion} {pointsPerQuestion === 1 ? 'punto' : 'puntos'} por respuesta correcta
      </Text>
      <Text style={styles.description}>{book.description}</Text>
      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => navigation.navigate('Quiz', { bookId: book.id })}
      >
        <Text style={styles.quizButtonText}>Empezar Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { alignItems: 'center', padding: 24 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  coverPlaceholder: {
    width: 120,
    height: 160,
    backgroundColor: '#4A90D9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  coverLetter: { color: '#fff', fontSize: 48, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  author: { fontSize: 16, color: '#666', marginBottom: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  pages: { fontSize: 14, color: '#999' },
  points: { fontSize: 14, color: '#4A90D9', fontWeight: '600', marginBottom: 16 },
  description: { fontSize: 15, color: '#444', lineHeight: 22, textAlign: 'center', marginBottom: 32 },
  quizButton: { backgroundColor: '#27ae60', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 10 },
  quizButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

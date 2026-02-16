import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { POINTS_PER_CORRECT } from '../utils/scoring';

type RouteProps = NativeStackScreenProps<RootStackParamList, 'QuizResult'>['route'];
type Nav = NativeStackNavigationProp<RootStackParamList>;

const DIFFICULTY_LABELS = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' } as const;

export default function QuizResultScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const { result } = route.params;

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const pointsPerQ = POINTS_PER_CORRECT[result.difficulty];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resultado</Text>

      <View style={styles.scoreCircle}>
        <Text style={styles.scoreNumber}>{result.correctAnswers}/{result.totalQuestions}</Text>
        <Text style={styles.scorePercent}>{percentage}%</Text>
      </View>

      <Text style={styles.pointsEarned}>+{result.pointsEarned} puntos</Text>
      <Text style={styles.difficultyInfo}>
        Dificultad: {DIFFICULTY_LABELS[result.difficulty]} ({pointsPerQ}pt/correcta)
      </Text>

      <View style={styles.breakdown}>
        {result.answers.map((answer, index) => (
          <View key={answer.questionId} style={styles.answerRow}>
            <Text style={styles.answerIndex}>P{index + 1}</Text>
            <View style={[styles.answerDot, { backgroundColor: answer.isCorrect ? '#27ae60' : '#e74c3c' }]} />
            <Text style={styles.answerLabel}>
              {answer.isCorrect ? 'Correcta' : 'Incorrecta'}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.backButtonText}>Volver al catálogo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreNumber: { fontSize: 32, fontWeight: 'bold' },
  scorePercent: { fontSize: 16, color: '#666' },
  pointsEarned: { fontSize: 24, fontWeight: '700', color: '#27ae60', marginBottom: 4 },
  difficultyInfo: { fontSize: 14, color: '#999', marginBottom: 24 },
  breakdown: { width: '100%', marginBottom: 32 },
  answerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  answerIndex: { fontSize: 14, fontWeight: '600', color: '#666', width: 30 },
  answerDot: { width: 10, height: 10, borderRadius: 5 },
  answerLabel: { fontSize: 14, color: '#444' },
  backButton: { backgroundColor: '#4A90D9', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

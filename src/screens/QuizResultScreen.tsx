import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInDown, ZoomIn, SlideInUp } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { POINTS_PER_CORRECT } from '../utils/scoring';
import { Colors, Fonts } from '../theme';

type RouteProps = NativeStackScreenProps<RootStackParamList, 'QuizResult'>['route'];
type Nav = NativeStackNavigationProp<RootStackParamList>;

const DIFFICULTY_LABELS = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' } as const;

export default function QuizResultScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const { result } = route.params;

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const pointsPerQ = POINTS_PER_CORRECT[result.difficulty];

  const emoji = percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '📖';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Score */}
      <View style={styles.scoreSection}>
        <Animated.Text entering={FadeInDown.delay(0).springify()} style={styles.resultEmoji}>
          {emoji}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(60).springify()} style={styles.resultTitle}>
          Resultado
        </Animated.Text>

        <Animated.View entering={ZoomIn.delay(140).springify().damping(12)} style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{result.correctAnswers}/{result.totalQuestions}</Text>
          <Text style={styles.scorePercent}>{percentage}%</Text>
        </Animated.View>

        {/* XP toast */}
        <Animated.View entering={SlideInUp.delay(320).springify().damping(10)} style={styles.xpToast}>
          <Text style={styles.xpToastText}>+{result.pointsEarned} XP</Text>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(420)} style={styles.difficultyInfo}>
          {DIFFICULTY_LABELS[result.difficulty]} · {pointsPerQ} pt por correcta
        </Animated.Text>
      </View>

      {/* Breakdown */}
      <Animated.View entering={FadeInDown.delay(480).springify()} style={styles.breakdown}>
        <Text style={styles.breakdownTitle}>Desglose</Text>
        {result.answers.map((answer, index) => (
          <Animated.View
            key={answer.questionId}
            entering={FadeInDown.delay(520 + index * 50).springify()}
            style={styles.answerRow}
          >
            <View style={[styles.answerBadge, answer.isCorrect ? styles.answerCorrect : styles.answerIncorrect]}>
              <Text style={styles.answerBadgeText}>{answer.isCorrect ? '✓' : '✗'}</Text>
            </View>
            <Text style={styles.answerLabel}>Pregunta {index + 1}</Text>
            <Text style={[styles.answerResult, answer.isCorrect ? styles.correctText : styles.incorrectText]}>
              {answer.isCorrect ? 'Correcta' : 'Incorrecta'}
            </Text>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(560).springify()}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>Volver al catálogo</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  scoreSection: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 20,
  },
  resultEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9a8f7e',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  scoreCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.paper,
    borderWidth: 2,
    borderColor: Colors.dust,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.ink,
  },
  scorePercent: {
    fontSize: 14,
    color: '#9a8f7e',
    fontWeight: '500',
  },
  xpToast: {
    backgroundColor: Colors.amber,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 10,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 6,
  },
  xpToastText: {
    fontFamily: Fonts.playfairBold,
    fontSize: 28,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  difficultyInfo: {
    fontSize: 13,
    color: '#9a8f7e',
  },
  breakdown: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.paper,
  },
  answerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerCorrect: {
    backgroundColor: 'rgba(74,124,95,0.15)',
  },
  answerIncorrect: {
    backgroundColor: 'rgba(192,57,43,0.12)',
  },
  answerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ink,
  },
  answerLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.ink,
  },
  answerResult: {
    fontSize: 13,
    fontWeight: '600',
  },
  correctText: {
    color: Colors.sage,
  },
  incorrectText: {
    color: Colors.red,
  },
  backButton: {
    backgroundColor: Colors.amber,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

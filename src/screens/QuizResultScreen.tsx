import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import Animated, { FadeInDown, ZoomIn, SlideInUp, FadeIn, ZoomInEasyDown } from 'react-native-reanimated';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { RootStackParamList } from '../types';
import { POINTS_PER_CORRECT, getLevelColor } from '../utils/scoring';
import { userService } from '../services';
import { AchievementNextHint } from '../types';
import { Colors, Fonts } from '../theme';

type RouteProps = NativeStackScreenProps<RootStackParamList, 'QuizResult'>['route'];
type Nav = NativeStackNavigationProp<RootStackParamList>;

const DIFFICULTY_LABELS = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' } as const;

export default function QuizResultScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const { result } = route.params;

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [nextHint, setNextHint] = useState<AchievementNextHint | null>(null);

  useEffect(() => {
    if (result.leveledUp) {
      const t = setTimeout(() => setShowLevelUp(true), 900);
      return () => clearTimeout(t);
    }
  }, [result.leveledUp]);

  useEffect(() => {
    userService.getAchievements().then((r) => setNextHint(r.nextHint ?? null)).catch(() => {});
  }, []);

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const pointsPerQ = POINTS_PER_CORRECT[result.difficulty];
  const emoji = percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '📖';

  const newLevelColor = result.newLevel ? getLevelColor(result.newLevel) : null;

  return (
    <View style={styles.root}>
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

          {/* Multiplier badges */}
          <Animated.View entering={FadeInDown.delay(380)} style={styles.badgeRow}>
            {result.isPerfect && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🎯 PERFECTO</Text>
              </View>
            )}
            {result.isFirstQuiz && (
              <View style={[styles.badge, styles.badgeGold]}>
                <Text style={styles.badgeText}>🚀 PRIMERA VEZ 3×</Text>
              </View>
            )}
            {result.isDailyBook && (
              <View style={[styles.badge, styles.badgeAmber]}>
                <Text style={styles.badgeText}>⭐ LIBRO DEL DÍA 2×</Text>
              </View>
            )}
            {result.streakMultiplier && result.streakMultiplier > 1 && (
              <View style={[styles.badge, styles.badgeSage]}>
                <Text style={styles.badgeText}>🔥 RACHA {result.streakCount}d ×{result.streakMultiplier}</Text>
              </View>
            )}
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

        {/* Proximity to next achievement */}
        {nextHint && (
          <Animated.View entering={FadeInDown.delay(520).springify()} style={styles.hintCard}>
            <Text style={styles.hintLabel}>Próximo logro</Text>
            <Text style={styles.hintText}>
              Te faltan <Text style={styles.hintBold}>{nextHint.remaining} {nextHint.unit}</Text> para "{nextHint.label}"
            </Text>
          </Animated.View>
        )}

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

      {/* Level-up overlay */}
      <Modal
        visible={showLevelUp}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setShowLevelUp(false)}
      >
        <Animated.View entering={FadeIn.duration(300)} style={styles.levelUpBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowLevelUp(false)} />

          <Animated.View
            entering={ZoomInEasyDown.delay(80).springify().damping(13)}
            style={[styles.levelUpCard, newLevelColor && { borderColor: newLevelColor.bg }]}
          >
            {/* Stars */}
            <Text style={styles.levelUpStars}>✨⭐✨</Text>

            <Text style={styles.levelUpTitle}>¡Subiste de nivel!</Text>

            {/* Level badge */}
            {newLevelColor && (
              <View style={[styles.levelUpBadge, { backgroundColor: newLevelColor.bg }]}>
                <Text style={[styles.levelUpBadgeText, { color: newLevelColor.accent }]}>
                  Nivel {result.newLevel} · {newLevelColor.label}
                </Text>
              </View>
            )}

            {/* Bonus points */}
            <View style={styles.bonusRow}>
              <Text style={styles.bonusLabel}>Bonus por nivel</Text>
              <Text style={[styles.bonusPoints, newLevelColor && { color: newLevelColor.bg }]}>
                +{result.bonusPoints} pts
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.levelUpBtn, newLevelColor && { backgroundColor: newLevelColor.bg }]}
              onPress={() => setShowLevelUp(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.levelUpBtnText}>¡Genial!</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  container: {
    flex: 1,
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
  // --- Level-up overlay ---
  levelUpBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  levelUpCard: {
    backgroundColor: Colors.cream,
    borderRadius: 28,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: Colors.amber,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  levelUpStars: {
    fontSize: 32,
    letterSpacing: 4,
  },
  levelUpTitle: {
    fontFamily: Fonts.playfairBold,
    fontSize: 26,
    color: Colors.ink,
    textAlign: 'center',
  },
  levelUpBadge: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  levelUpBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.paper,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  bonusLabel: {
    fontSize: 14,
    color: '#7a6f5e',
    fontWeight: '500',
  },
  bonusPoints: {
    fontFamily: Fonts.playfairBold,
    fontSize: 22,
    color: Colors.amber,
  },
  levelUpBtn: {
    backgroundColor: Colors.amber,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 4,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  levelUpBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 4,
  },
  badge: {
    backgroundColor: 'rgba(74,124,95,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(74,124,95,0.3)',
  },
  badgeGold: {
    backgroundColor: 'rgba(180,83,9,0.1)',
    borderColor: 'rgba(180,83,9,0.3)',
  },
  badgeAmber: {
    backgroundColor: 'rgba(212,130,26,0.1)',
    borderColor: 'rgba(212,130,26,0.3)',
  },
  badgeSage: {
    backgroundColor: 'rgba(220,100,20,0.1)',
    borderColor: 'rgba(220,100,20,0.3)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.ink,
    letterSpacing: 0.5,
  },
  hintCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  hintLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9a8f7e',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  hintText: {
    fontSize: 13,
    color: Colors.ink,
    lineHeight: 19,
  },
  hintBold: {
    fontWeight: '700',
    color: Colors.amber,
  },
});

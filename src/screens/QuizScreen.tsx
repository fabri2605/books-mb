import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useQuiz } from '../hooks/useQuiz';
import QuestionCard from '../components/QuestionCard';
import { Colors } from '../theme';

type RouteProps = NativeStackScreenProps<RootStackParamList, 'Quiz'>['route'];
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function QuizScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const {
    currentQuestion,
    currentIndex,
    questions,
    selectedOptionId,
    isLastQuestion,
    canGoNext,
    loading,
    submitting,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  } = useQuiz(route.params.bookId);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loadingText}>No hay preguntas disponibles para este libro.</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    const result = await submitQuiz();
    navigation.replace('QuizResult', { result });
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Progress header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Pregunta {currentIndex + 1} de {questions.length}</Text>
          <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question */}
      <QuestionCard
        question={currentQuestion}
        selectedOptionId={selectedOptionId}
        onSelectOption={selectAnswer}
      />

      {/* Navigation */}
      <View style={styles.nav}>
        {currentIndex > 0 ? (
          <TouchableOpacity style={styles.navBtn} onPress={prevQuestion}>
            <Text style={styles.navBtnText}>← Anterior</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.submitBtn, !canGoNext && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={!canGoNext || submitting}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? 'Enviando...' : 'Finalizar'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, !canGoNext && styles.btnDisabled]}
            onPress={nextQuestion}
            disabled={!canGoNext}
          >
            <Text style={styles.nextBtnText}>Siguiente →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cream,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#7a6f5e',
  },
  progressHeader: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dust,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#9a8f7e',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  progressPct: {
    fontSize: 12,
    color: Colors.amber,
    fontWeight: '700',
  },
  progressBar: {
    height: 5,
    backgroundColor: Colors.paper,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dust,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.amber,
    borderRadius: 3,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dust,
  },
  navBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.paper,
    borderWidth: 1.5,
    borderColor: Colors.dust,
  },
  navBtnText: {
    fontSize: 14,
    color: '#7a6f5e',
    fontWeight: '600',
  },
  nextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.amber,
  },
  nextBtnText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.sage,
  },
  submitBtnText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.45,
  },
});

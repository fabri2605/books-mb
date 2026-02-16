import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useQuiz } from '../hooks/useQuiz';
import QuestionCard from '../components/QuestionCard';

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
        <ActivityIndicator size="large" color="#4A90D9" />
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

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          Pregunta {currentIndex + 1} de {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
        </View>
      </View>

      <QuestionCard
        question={currentQuestion}
        selectedOptionId={selectedOptionId}
        onSelectOption={selectAnswer}
      />

      <View style={styles.nav}>
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={prevQuestion}>
            <Text style={styles.navButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}
        <View style={styles.spacer} />
        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.submitButton, !canGoNext && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!canGoNext || submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Enviando...' : 'Enviar'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextButton, !canGoNext && styles.buttonDisabled]}
            onPress={nextQuestion}
            disabled={!canGoNext}
          >
            <Text style={styles.nextButtonText}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  progress: { padding: 20, paddingBottom: 0 },
  progressText: { fontSize: 14, color: '#999', marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: '#f0f0f0', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#4A90D9', borderRadius: 2 },
  nav: { flexDirection: 'row', padding: 20, paddingTop: 0 },
  spacer: { flex: 1 },
  navButton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, backgroundColor: '#f0f0f0' },
  navButtonText: { fontSize: 16, color: '#333' },
  nextButton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, backgroundColor: '#4A90D9' },
  nextButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  submitButton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, backgroundColor: '#27ae60' },
  submitButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  buttonDisabled: { opacity: 0.5 },
});

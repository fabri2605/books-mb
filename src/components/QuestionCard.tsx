import { StyleSheet, Text, ScrollView } from 'react-native';
import { Question } from '../types';
import OptionButton from './OptionButton';
import { Colors } from '../theme';

interface Props {
  question: Question;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
}

export default function QuestionCard({ question, selectedOptionId, onSelectOption }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.questionText}>{question.text}</Text>
      {question.options.map((option) => (
        <OptionButton
          key={option.id}
          label={option.text}
          selected={selectedOptionId === option.id}
          onPress={() => onSelectOption(option.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 8,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: 20,
    lineHeight: 25,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { Question } from '../types';
import OptionButton from './OptionButton';

interface Props {
  question: Question;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
}

export default function QuestionCard({ question, selectedOptionId, onSelectOption }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.text}</Text>
      {question.options.map((option) => (
        <OptionButton
          key={option.id}
          label={option.text}
          selected={selectedOptionId === option.id}
          onPress={() => onSelectOption(option.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  questionText: { fontSize: 18, fontWeight: '600', marginBottom: 20, lineHeight: 26 },
});

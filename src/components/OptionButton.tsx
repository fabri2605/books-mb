import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  state?: 'default' | 'correct' | 'incorrect';
}

export default function OptionButton({ label, selected, onPress, disabled, state = 'default' }: Props) {
  const isCorrect = state === 'correct';
  const isIncorrect = state === 'incorrect';

  const bgColor =
    isCorrect ? 'rgba(74,124,95,0.12)'
    : isIncorrect ? 'rgba(192,57,43,0.12)'
    : selected ? 'rgba(212,130,26,0.1)'
    : Colors.paper;

  const borderColor =
    isCorrect ? Colors.sage
    : isIncorrect ? Colors.red
    : selected ? Colors.amber
    : Colors.dust;

  const textColor =
    isCorrect ? Colors.sage
    : isIncorrect ? Colors.red
    : selected ? Colors.amber
    : Colors.ink;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor, borderColor }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 5,
    borderWidth: 1.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});

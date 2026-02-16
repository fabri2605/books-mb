import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  state?: 'default' | 'correct' | 'incorrect';
}

export default function OptionButton({ label, selected, onPress, disabled, state = 'default' }: Props) {
  const bgColor =
    state === 'correct' ? '#27ae60'
    : state === 'incorrect' ? '#e74c3c'
    : selected ? '#4A90D9'
    : '#f0f0f0';

  const textColor = selected || state !== 'default' ? '#fff' : '#333';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 6,
  },
  text: { fontSize: 16 },
});

import { StyleSheet, Text, View } from 'react-native';
import { Difficulty } from '../types';

const COLORS: Record<Difficulty, string> = {
  easy: '#27ae60',
  medium: '#f39c12',
  hard: '#e74c3c',
};

const LABELS: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
};

interface Props {
  difficulty: Difficulty;
}

export default function DifficultyBadge({ difficulty }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: COLORS[difficulty] }]}>
      <Text style={styles.text}>{LABELS[difficulty]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  text: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

import { StyleSheet, Text, View } from 'react-native';
import { Difficulty } from '../types';
import { Colors } from '../theme';

const BG_COLORS: Record<Difficulty, string> = {
  easy: 'rgba(74,124,95,0.12)',
  medium: 'rgba(212,130,26,0.12)',
  hard: 'rgba(192,57,43,0.12)',
};

const TEXT_COLORS: Record<Difficulty, string> = {
  easy: Colors.sage,
  medium: Colors.amber,
  hard: Colors.red,
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
    <View style={[styles.badge, { backgroundColor: BG_COLORS[difficulty] }]}>
      <Text style={[styles.text, { color: TEXT_COLORS[difficulty] }]}>
        {LABELS[difficulty]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

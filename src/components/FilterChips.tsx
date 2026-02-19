import { StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Difficulty } from '../types';
import { Colors } from '../theme';

interface Props {
  selected: Difficulty | null;
  onSelect: (difficulty: Difficulty | null) => void;
}

const FILTERS: { label: string; value: Difficulty | null }[] = [
  { label: 'Todos', value: null },
  { label: 'Fácil', value: 'easy' },
  { label: 'Medio', value: 'medium' },
  { label: 'Difícil', value: 'hard' },
];

export default function FilterChips({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = selected === filter.value;
        return (
          <TouchableOpacity
            key={filter.label}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(filter.value)}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 4, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.paper,
    borderWidth: 1.5,
    borderColor: Colors.dust,
  },
  chipActive: {
    backgroundColor: Colors.amber,
    borderColor: Colors.amber,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7a6f5e',
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
});

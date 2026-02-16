import { StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Difficulty } from '../types';

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
  container: { paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  chipActive: { backgroundColor: '#4A90D9' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
});

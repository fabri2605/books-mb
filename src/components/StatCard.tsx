import { StyleSheet, Text, View } from 'react-native';

interface Props {
  label: string;
  value: number | string;
}

export default function StatCard({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  value: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 12, color: '#999', marginTop: 4 },
});

import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme';

interface Props {
  label: string;
  value: number | string;
}

export default function StatCard({ label, value }: Props) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.amberLight,
  },
  label: {
    fontSize: 9,
    color: '#6a6055',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
    fontWeight: '600',
  },
});

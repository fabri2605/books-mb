import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Colors, Fonts } from '../theme';

interface Props {
  streak: number;
  visible: boolean;
  onClose: () => void;
}

function streakMessage(n: number): string {
  if (n === 1) return '¡Bienvenido de vuelta! Tu racha empieza hoy.';
  if (n < 5)   return '¡Vas bien! Seguí así cada día.';
  if (n < 10)  return '¡Excelente constancia! No pares ahora.';
  if (n < 30)  return '¡Increíble! Sos un lector de élite.';
  return '¡Leyenda pura! No hay quien te detenga.';
}

export default function StreakModal({ streak, visible, onClose }: Props) {
  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(220)} style={styles.overlay}>
        <Animated.View entering={ZoomIn.delay(80).springify().damping(13)} style={styles.card}>
          {/* Fire stack — simulates scale by stacking emoji */}
          <View style={styles.fireWrap}>
            <Text style={styles.fireBg}>🔥</Text>
            <Text style={styles.fireFg}>🔥</Text>
          </View>

          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>
            {streak === 1 ? 'día de racha' : 'días de racha'}
          </Text>

          <Text style={styles.message}>{streakMessage(streak)}</Text>

          <TouchableOpacity style={styles.btn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.btnText}>¡Seguir leyendo!</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,14,11,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.cream,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
    elevation: 16,
  },
  fireWrap: {
    marginBottom: 4,
  },
  fireBg: {
    fontSize: 64,
    opacity: 0.3,
    position: 'absolute',
    transform: [{ scale: 1.4 }],
    alignSelf: 'center',
  },
  fireFg: {
    fontSize: 64,
  },
  streakNum: {
    fontFamily: Fonts.playfairBlack,
    fontSize: 72,
    color: Colors.amber,
    lineHeight: 80,
    marginTop: 8,
  },
  streakLabel: {
    fontFamily: Fonts.playfairBold,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#7a6f5e',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  btn: {
    width: '100%',
    backgroundColor: Colors.amber,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  btnText: {
    color: Colors.white,
    fontFamily: Fonts.playfairBold,
    fontSize: 16,
  },
});

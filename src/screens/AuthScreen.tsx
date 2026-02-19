import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { Colors } from '../theme';

export default function AuthScreen() {
  const { signIn, isLoading } = useGoogleAuth();

  return (
    <View style={styles.container}>
      {/* Hero section */}
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>📖</Text>
        </View>
        <Text style={styles.heroTitle}>BookQuest</Text>
        <Text style={styles.heroTagline}>LEE · APRENDE · COMPITE</Text>
      </View>

      {/* Form card */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Bienvenido</Text>

        <TouchableOpacity style={styles.btnGoogle} onPress={signIn} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.ink} />
          ) : (
            <>
              <View style={styles.googleDot} />
              <Text style={styles.btnGoogleText}>Continuar con Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Al continuar aceptás los <Text style={styles.footerLink}>Términos de uso</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.forest,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconWrap: {
    width: 72,
    height: 72,
    backgroundColor: Colors.amber,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  iconText: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.cream,
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTagline: {
    fontSize: 11,
    color: Colors.sage,
    letterSpacing: 3,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 48,
    gap: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 4,
  },
  btnGoogle: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.dust,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285f4',
    borderWidth: 3,
    borderColor: '#ea4335',
  },
  btnGoogleText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.ink,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9a8f7e',
    marginTop: 4,
  },
  footerLink: {
    color: Colors.amber,
    fontWeight: '600',
  },
});

import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { Colors, Fonts } from '../theme';

export default function AuthScreen() {
  const { signIn, isLoading } = useGoogleAuth();

  return (
    <View style={styles.container}>
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Hero section */}
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>📖</Text>
        </View>
        <Text style={styles.heroTitle}>BookBrawl</Text>
        <Text style={styles.heroTagline}>LEE · APRENDE · COMPITE</Text>
      </View>

      {/* Form card */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Bienvenido</Text>
        <Text style={styles.formSubtitle}>Iniciá sesión para seguir tu progreso y competir con otros lectores</Text>

        <TouchableOpacity style={styles.btnGoogle} onPress={signIn} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.ink} />
          ) : (
            <>
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
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
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(74,124,95,0.25)',
    top: -60,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212,130,26,0.12)',
    top: 120,
    left: -60,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconWrap: {
    width: 80,
    height: 80,
    backgroundColor: Colors.amber,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.amber,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconText: {
    fontSize: 36,
  },
  heroTitle: {
    fontFamily: Fonts.playfairBlack,
    fontSize: 42,
    color: Colors.cream,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  heroTagline: {
    fontSize: 11,
    color: Colors.sage,
    letterSpacing: 4,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 32,
    paddingBottom: 52,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  formTitle: {
    fontFamily: Fonts.playfairBold,
    fontSize: 26,
    color: Colors.ink,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#7a6f5e',
    lineHeight: 20,
    marginTop: -4,
    marginBottom: 4,
  },
  btnGoogle: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.dust,
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  googleIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  btnGoogleText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.ink,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9a8f7e',
    marginTop: 2,
  },
  footerLink: {
    color: Colors.amber,
    fontWeight: '600',
  },
});

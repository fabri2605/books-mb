import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useState, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { userService } from '../services';
import { useAuthStore } from '../hooks/useAuthStore';
import { Colors, Fonts } from '../theme';

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

export default function UsernameSetupScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUsernameSetup = useAuthStore((s) => s.clearUsernameSetup);
  const currentUser = useAuthStore((s) => s.user);

  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((text: string) => {
    setValue(text.toLowerCase().replace(/[^a-z0-9_]/g, ''));
    setError('');
  }, []);

  const validate = (): string => {
    if (value.length < 3) return 'Mínimo 3 caracteres.';
    if (value.length > 30) return 'Máximo 30 caracteres.';
    if (!USERNAME_RE.test(value)) return 'Solo letras minúsculas, números y guion bajo.';
    return '';
  };

  const handleSubmit = useCallback(async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const updatedUser = await userService.updateUsername(value);
      setUser(updatedUser);
      clearUsernameSetup();
    } catch (e: any) {
      const msg = e?.response?.data?.error;
      if (msg?.includes('uso')) {
        setError('Ese username ya está en uso, elegí otro.');
      } else {
        setError('Ocurrió un error. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }, [value, setUser, clearUsernameSetup]);

  const isValid = USERNAME_RE.test(value);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#142b1f', '#1e3d2c', '#243322']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>
          Elegí tu username único. Vas a poder cambiarlo después desde tu perfil.
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.label}>Username</Text>

        <View style={[styles.inputWrap, error ? styles.inputError : isValid && value.length > 0 ? styles.inputOk : null]}>
          <Text style={styles.at}>@</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={handleChange}
            placeholder="tu_username"
            placeholderTextColor="#c0b8a8"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            maxLength={30}
          />
          {isValid && value.length > 0 && !error && (
            <Text style={styles.checkMark}>✓</Text>
          )}
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text style={styles.hint}>
            3-30 caracteres · letras minúsculas, números y guion bajo (_)
          </Text>
        )}

        <TouchableOpacity
          style={[styles.btn, (!isValid || loading) && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.btnText}>Continuar</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e7',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.playfairBold,
    fontSize: 32,
    color: '#f5f0e7',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(245,240,231,0.55)',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
  },
  body: {
    backgroundColor: '#f5f0e7',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 28,
    paddingBottom: 48,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  label: {
    fontFamily: Fonts.playfairBold,
    fontSize: 16,
    color: '#1a1410',
    marginBottom: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e2d9cb',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  inputError: {
    borderColor: '#c0594a',
  },
  inputOk: {
    borderColor: '#3a7a5a',
  },
  at: {
    fontSize: 16,
    color: '#9a8868',
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1410',
    padding: 0,
  },
  checkMark: {
    fontSize: 16,
    color: '#3a7a5a',
    fontWeight: '700',
  },
  hint: {
    fontSize: 11,
    color: '#9a8868',
    lineHeight: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#c0594a',
    fontWeight: '600',
  },
  btn: {
    backgroundColor: Colors.amber,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

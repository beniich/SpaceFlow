import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { authService } from '../../src/services/auth.service';
import { COLORS } from '../../src/utils/constants';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore(s => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authService.authenticateWithBiometric().then(async (success) => {
      if (success) {
        try {
          await useAuthStore.getState().loadStoredAuth();
          router.replace('/(tabs)');
        } catch {}
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);

      if (response.requiresTwoFactor) {
        router.push('/(auth)/2fa');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert(
        'Erreur de connexion',
        error.response?.data?.error || 'Identifiants invalides'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const success = await authService.authenticateWithBiometric();
    if (success) {
      try {
        await useAuthStore.getState().loadStoredAuth();
        router.replace('/(tabs)');
      } catch {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter avec email et mot de passe');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🐝</Text>
        <Text style={styles.title}>BeeCarbonat</Text>
        <Text style={styles.subtitle}>Gestion de maintenance</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.light.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor={COLORS.light.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
            <Text style={styles.biometricText}>
              👆 Utiliser la biométrie (Face ID / Empreinte)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.light.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: COLORS.light.bgSubtle,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.light.text,
  },
  button: {
    backgroundColor: COLORS.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    alignItems: 'center',
    padding: 12,
  },
  biometricText: {
    color: COLORS.light.primary,
    fontSize: 14,
  },
});

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { COLORS } from '../../src/utils/constants';

export default function TwoFactorScreen() {
  const router = useRouter();
  const verifyTwoFactor = useAuthStore(s => s.verifyTwoFactor);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length < 6) {
      Alert.alert('Code invalide', 'Veuillez saisir le code 2FA à 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      await verifyTwoFactor(code);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Erreur 2FA',
        error.response?.data?.error || 'Code 2FA invalide ou expiré'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Vérification 2FA</Text>
        <Text style={styles.subtitle}>Saisissez le code généré par votre application d'authentification</Text>

        <TextInput
          style={styles.input}
          placeholder="Code à 6 chiffres"
          placeholderTextColor={COLORS.light.textSecondary}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Vérification...' : 'Valider'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Annuler</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: COLORS.light.bgSubtle,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    color: COLORS.light.text,
    textAlign: 'center',
    letterSpacing: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 20,
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
  backButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  backText: {
    color: COLORS.light.textSecondary,
    fontSize: 14,
  },
});

import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, Alert, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Camera, MapPin, Send } from 'lucide-react-native';
import { ticketService } from '../../src/services/ticket.service';
import { COLORS, PRIORITY_COLORS } from '../../src/utils/constants';

export default function NewTicket() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<keyof typeof PRIORITY_COLORS>('MEDIUM');
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'La caméra est nécessaire pour capturer une photo');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'La localisation est nécessaire');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    });
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Champs requis', 'Veuillez saisir au minimum un titre et une description');
      return;
    }

    setLoading(true);
    try {
      await ticketService.create({
        title,
        description,
        priority,
        photos,
        location: location || undefined,
      });
      Alert.alert('Succès', 'Ticket d\'incident créé avec succès');
      router.back();
    } catch (error: any) {
      if (error.message && error.message.includes('hors-ligne')) {
        Alert.alert(
          'Mode Hors-Ligne',
          'Ticket mis en file d\'attente. Il sera synchronisé automatiquement lors du retour en ligne.',
          [{ text: 'Compris', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Erreur', error.response?.data?.error || 'Erreur lors de la création du ticket');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nouveau Ticket d'Incident</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Titre de l'incident *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Fuite compresseur HVAC L3"
          placeholderTextColor={COLORS.light.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description détaillée *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description du symptôme observé..."
          placeholderTextColor={COLORS.light.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Niveau de priorité</Text>
        <View style={styles.priorityGrid}>
          {(Object.keys(PRIORITY_COLORS) as Array<keyof typeof PRIORITY_COLORS>).map(p => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityChip,
                priority === p && { backgroundColor: PRIORITY_COLORS[p] },
              ]}
              onPress={() => setPriority(p)}
            >
              <Text style={[
                styles.priorityText,
                priority === p && styles.priorityTextActive,
              ]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Photos terrain ({photos.length})</Text>
        <View style={styles.photoGrid}>
          {photos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.photo} />
          ))}
          <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
            <Camera size={26} color={COLORS.light.textSecondary} />
            <Text style={styles.addPhotoText}>Prendre photo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
          <MapPin size={20} color={COLORS.light.primary} />
          <Text style={styles.locationText}>
            {location
              ? `Coordonnées GPS: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
              : 'Ajouter ma position GPS'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Send size={20} color="#fff" />
            <Text style={styles.submitText}>Créer le ticket</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light.bg },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  back: { color: COLORS.light.primary, fontSize: 16, marginBottom: 12, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.light.text },
  form: { padding: 20, gap: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.light.text, marginTop: 4 },
  input: {
    backgroundColor: COLORS.light.bgSubtle,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: COLORS.light.text,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  priorityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  priorityChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  priorityText: { fontSize: 13, color: COLORS.light.textSecondary, fontWeight: '500' },
  priorityTextActive: { color: '#fff', fontWeight: 'bold' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photo: { width: 80, height: 80, borderRadius: 10 },
  addPhoto: {
    width: 80, height: 80, borderRadius: 10,
    backgroundColor: COLORS.light.bgSubtle,
    borderWidth: 2, borderColor: COLORS.light.border, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
  addPhotoText: { fontSize: 10, color: COLORS.light.textSecondary, marginTop: 4, fontWeight: '500' },
  locationButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, borderWidth: 1, borderColor: COLORS.light.border,
    borderRadius: 12, backgroundColor: COLORS.light.bgSubtle,
  },
  locationText: { color: COLORS.light.text, fontSize: 13, fontWeight: '500' },
  submitButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.light.primary,
    margin: 20, padding: 16, borderRadius: 12, gap: 8,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

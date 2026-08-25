import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { api } from '../../src/services/api';
import { Asset } from '../../src/types';
import { COLORS } from '../../src/utils/constants';
import { QrCode, Layers } from 'lucide-react-native';

export default function AssetsList() {
  const router = useRouter();
  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Asset[] }>('/api/assets');
      return data.data || [];
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Équipements & Actifs</Text>
          <Text style={styles.subtitle}>Base patrimoniale et QR tags</Text>
        </View>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push('/scanner')}
        >
          <QrCode size={20} color="#fff" />
          <Text style={styles.scanText}>Scan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {(assets || []).map(asset => (
          <View key={asset.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{asset.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: asset.status === 'OPERATIONAL' ? '#10b981' : '#f59e0b' }]}>
                <Text style={styles.statusText}>{asset.status}</Text>
              </View>
            </View>
            <Text style={styles.location}>📍 {asset.location || 'Localisation générale'}</Text>
            <Text style={styles.type}>Catégorie : {asset.type}</Text>
            <View style={styles.healthBar}>
              <Text style={styles.healthLabel}>Score de santé : {asset.healthScore || 95}%</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.light.text },
  subtitle: { fontSize: 13, color: COLORS.light.textSecondary, marginTop: 4 },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  scanText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  list: { paddingHorizontal: 20 },
  card: {
    backgroundColor: COLORS.light.bgSubtle,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: COLORS.light.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  location: { fontSize: 13, color: COLORS.light.textSecondary, marginTop: 6 },
  type: { fontSize: 12, color: COLORS.light.textSecondary, marginTop: 2 },
  healthBar: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.light.border },
  healthLabel: { fontSize: 11, color: COLORS.light.textSecondary, fontWeight: '500' },
});

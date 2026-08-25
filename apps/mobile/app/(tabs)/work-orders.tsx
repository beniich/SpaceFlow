import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { workOrderService } from '../../src/services/workOrder.service';
import { COLORS, PRIORITY_COLORS, STATUS_COLORS } from '../../src/utils/constants';
import { Search, Filter, Plus } from 'lucide-react-native';

export default function WorkOrdersList() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  const { data: workOrders, isLoading, refetch } = useQuery({
    queryKey: ['work-orders', filterStatus],
    queryFn: () => workOrderService.list({ status: filterStatus }),
  });

  const filtered = (workOrders || []).filter(wo =>
    wo.title.toLowerCase().includes(search.toLowerCase()) ||
    wo.asset?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Interventions (GMAO)</Text>
        <Text style={styles.subtitle}>{filtered.length} intervention(s) répertoriée(s)</Text>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={COLORS.light.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre ou équipement..."
          placeholderTextColor={COLORS.light.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {filtered.map(wo => (
          <TouchableOpacity
            key={wo.id}
            style={styles.card}
            onPress={() => router.push(`/work-order/${wo.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{wo.title}</Text>
              <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[wo.priority] || '#3b82f6' }]}>
                <Text style={styles.badgeText}>{wo.priority}</Text>
              </View>
            </View>
            <Text style={styles.assetName}>📍 {wo.asset?.name || 'Non spécifié'}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.statusText}>Statut: <Text style={{ fontWeight: 'bold' }}>{wo.status}</Text></Text>
              <Text style={styles.dateText}>{wo.dueDate ? new Date(wo.dueDate).toLocaleDateString('fr-FR') : ''}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light.bg },
  header: { padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.light.text },
  subtitle: { fontSize: 13, color: COLORS.light.textSecondary, marginTop: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.bgSubtle,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: { flex: 1, color: COLORS.light.text, fontSize: 14 },
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
  cardTitle: { fontSize: 15, fontWeight: '600', color: COLORS.light.text, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  assetName: { fontSize: 13, color: COLORS.light.textSecondary, marginTop: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.light.border, paddingTop: 8 },
  statusText: { fontSize: 11, color: COLORS.light.textSecondary },
  dateText: { fontSize: 11, color: COLORS.light.textSecondary },
});

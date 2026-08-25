import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { workOrderService } from '../../src/services/workOrder.service';
import { ticketService } from '../../src/services/ticket.service';
import { COLORS, PRIORITY_COLORS } from '../../src/utils/constants';
import { QrCode, Camera, Bell } from 'lucide-react-native';

export default function Dashboard() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);

  const { data: workOrders, refetch } = useQuery({
    queryKey: ['work-orders', 'mine'],
    queryFn: () => workOrderService.list({ assignedToMe: true }),
  });

  const { data: tickets } = useQuery({
    queryKey: ['tickets', 'recent'],
    queryFn: () => ticketService.list(),
  });

  const activeWO = workOrders?.filter(w => w.status === 'IN_PROGRESS').length || 0;
  const pendingWO = workOrders?.filter(w => w.status === 'TO_DO' || w.status === 'SCHEDULED').length || 0;
  const openTickets = tickets?.filter(t => t.status === 'OPEN').length || 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.name || 'Technicien'} 👋</Text>
          <Text style={styles.subtitle}>Voici votre activité terrain du jour</Text>
        </View>
        <TouchableOpacity style={styles.bellButton}>
          <Bell size={22} color={COLORS.light.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeWO}</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingWO}</Text>
          <Text style={styles.statLabel}>À faire</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{openTickets}</Text>
          <Text style={styles.statLabel}>Tickets ouverts</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/scanner')}
          >
            <QrCode size={30} color={COLORS.light.primary} />
            <Text style={styles.actionText}>Scanner QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/ticket/new')}
          >
            <Camera size={30} color={COLORS.light.primary} />
            <Text style={styles.actionText}>Nouveau ticket</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes interventions assignées</Text>
        {workOrders && workOrders.length > 0 ? (
          workOrders.slice(0, 5).map(wo => (
            <TouchableOpacity
              key={wo.id}
              style={styles.workOrderCard}
              onPress={() => router.push(`/work-order/${wo.id}`)}
            >
              <View style={styles.woHeader}>
                <Text style={styles.woTitle} numberOfLines={1}>{wo.title}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[wo.priority] || '#ff5500' }]}>
                  <Text style={styles.priorityText}>{wo.priority}</Text>
                </View>
              </View>
              <Text style={styles.woAsset}>📍 {wo.asset?.name || 'Équipement non assigné'}</Text>
              <Text style={styles.woDue}>⏱️ Échéance : {wo.dueDate ? new Date(wo.dueDate).toLocaleDateString('fr-FR') : 'Non définie'}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune intervention en attente</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  greeting: { fontSize: 22, fontWeight: 'bold', color: COLORS.light.text },
  subtitle: { fontSize: 13, color: COLORS.light.textSecondary, marginTop: 4 },
  bellButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.light.bgSubtle,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.light.bgSubtle,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  statNumber: { fontSize: 26, fontWeight: 'bold', color: COLORS.light.text },
  statLabel: { fontSize: 11, color: COLORS.light.textSecondary, marginTop: 4 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.light.text, marginBottom: 12 },
  actions: { paddingHorizontal: 20, marginBottom: 24 },
  actionGrid: { flexDirection: 'row', gap: 12 },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.light.bgSubtle,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  actionText: { fontSize: 13, fontWeight: '600', color: COLORS.light.text, marginTop: 8 },
  workOrderCard: {
    backgroundColor: COLORS.light.bgSubtle,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  woHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  woTitle: { fontSize: 15, fontWeight: '600', color: COLORS.light.text, flex: 1, marginRight: 8 },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  woAsset: { fontSize: 13, color: COLORS.light.textSecondary },
  woDue: { fontSize: 12, color: COLORS.light.textSecondary, marginTop: 4 },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: COLORS.light.bgSubtle,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    alignItems: 'center',
  },
  emptyText: { color: COLORS.light.textSecondary, fontSize: 13 },
});

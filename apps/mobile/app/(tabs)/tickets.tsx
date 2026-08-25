import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ticketService } from '../../src/services/ticket.service';
import { COLORS, STATUS_COLORS, PRIORITY_COLORS } from '../../src/utils/constants';
import { Plus } from 'lucide-react-native';

export default function TicketsList() {
  const router = useRouter();
  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.list(),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tickets d'incident</Text>
          <Text style={styles.subtitle}>{tickets?.length || 0} ticket(s) actif(s)</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/ticket/new')}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.addText}>Créer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {(tickets || []).map(ticket => (
          <View key={ticket.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{ticket.title}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[ticket.status] || '#3b82f6' }]}>
                <Text style={styles.badgeText}>{ticket.status}</Text>
              </View>
            </View>
            <Text style={styles.description} numberOfLines={2}>{ticket.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.priorityText}>Priorité: <Text style={{ color: PRIORITY_COLORS[ticket.priority] }}>{ticket.priority}</Text></Text>
              <Text style={styles.dateText}>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</Text>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  addText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
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
  description: { fontSize: 13, color: COLORS.light.textSecondary, marginTop: 6, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.light.border, paddingTop: 8 },
  priorityText: { fontSize: 11, color: COLORS.light.textSecondary },
  dateText: { fontSize: 11, color: COLORS.light.textSecondary },
});

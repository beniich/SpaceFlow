import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workOrderService } from '../../src/services/workOrder.service';
import { COLORS } from '../../src/utils/constants';
import { Check, Play, Square } from 'lucide-react-native';

export default function WorkOrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({});

  const { data: wo, isLoading } = useQuery({
    queryKey: ['work-order', id],
    queryFn: () => workOrderService.getOne(id!),
  });

  const startMutation = useMutation({
    mutationFn: () => workOrderService.start(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work-order', id] }),
  });

  const completeMutation = useMutation({
    mutationFn: () => workOrderService.complete(id!, {
      tasks: (wo?.tasks || []).map(t => ({
        id: t.id,
        completed: taskStates[t.id] ?? t.completed,
      })),
      notes: note,
    }),
    onSuccess: () => {
      Alert.alert('Succès', 'Intervention clôturée avec succès');
      router.back();
    },
  });

  if (isLoading || !wo) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.light.primary} />
      </View>
    );
  }

  const toggleTask = (taskId: string) => {
    setTaskStates(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const tasksList = wo.tasks || [];
  const completedCount = tasksList.filter(t => taskStates[t.id] ?? t.completed).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{wo.title}</Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Asset / Équipement" value={wo.asset?.name || 'Non assigné'} />
        <InfoRow label="Statut" value={wo.status} />
        <InfoRow label="Priorité" value={wo.priority} />
        <InfoRow label="Durée estimée" value={`${wo.estimatedDuration || 60} min`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{wo.description || 'Aucune description fournie.'}</Text>
      </View>

      {tasksList.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tâches ({completedCount}/{tasksList.length})</Text>
          {tasksList.map(task => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskRow}
              onPress={() => toggleTask(task.id)}
            >
              <View style={[
                styles.checkbox,
                (taskStates[task.id] ?? task.completed) && styles.checkboxChecked,
              ]}>
                {(taskStates[task.id] ?? task.completed) && <Check size={16} color="#fff" />}
              </View>
              <Text style={[
                styles.taskText,
                (taskStates[task.id] ?? task.completed) && styles.taskTextDone,
              ]}>
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rapport d'intervention & Notes</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Observations terrain, pièces remplacées..."
          placeholderTextColor={COLORS.light.textSecondary}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.actions}>
        {wo.status === 'TO_DO' && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => startMutation.mutate()}
            disabled={startMutation.isPending}
          >
            <Play size={20} color="#fff" />
            <Text style={styles.buttonText}>Démarrer l'intervention</Text>
          </TouchableOpacity>
        )}

        {wo.status === 'IN_PROGRESS' && (
          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
          >
            <Square size={20} color="#fff" />
            <Text style={styles.buttonText}>Clôturer l'intervention</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light.bg },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  back: { color: COLORS.light.primary, fontSize: 16, marginBottom: 12, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.light.text },
  infoCard: {
    margin: 20,
    backgroundColor: COLORS.light.bgSubtle,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: { color: COLORS.light.textSecondary, fontSize: 13 },
  infoValue: { color: COLORS.light.text, fontSize: 13, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.light.text, marginBottom: 12 },
  description: { fontSize: 14, color: COLORS.light.textSecondary, lineHeight: 22 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.light.border,
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.light.success,
    borderColor: COLORS.light.success,
  },
  taskText: { fontSize: 15, color: COLORS.light.text, flex: 1 },
  taskTextDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  textArea: {
    backgroundColor: COLORS.light.bgSubtle,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    color: COLORS.light.text,
  },
  actions: { padding: 20 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  primaryButton: { backgroundColor: COLORS.light.primary },
  successButton: { backgroundColor: COLORS.light.success },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

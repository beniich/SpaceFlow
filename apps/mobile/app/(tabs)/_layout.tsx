import { Tabs } from 'expo-router';
import { Home, ClipboardList, Package, Layers } from 'lucide-react-native';
import { COLORS } from '../../src/utils/constants';
import { offlineQueue } from '../../src/services/offlineQueue.service';
import { useEffect, useState } from 'react';

export default function TabsLayout() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    return offlineQueue.subscribe(setPendingCount);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.light.primary,
        tabBarInactiveTintColor: COLORS.light.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.light.bg,
          borderTopColor: COLORS.light.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="work-orders"
        options={{
          title: 'Interventions',
          tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} />,
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color }) => <Package size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: 'Équipements',
          tabBarIcon: ({ color }) => <Layers size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export function useRealtimeBookings() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const socket = useSocket(token || undefined);

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (b: any) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast(`📅 Nouvelle réservation: ${b.spaceName || 'Espace'}`, { icon: '🆕' });
    };

    const handleCheckIn = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast.success(`✅ ${data.memberName || 'Membre'} checked-in à ${data.spaceName || 'l\'espace'}`);
    };

    const handleCancelled = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast(`❌ Réservation ${data.reference || ''} annulée`);
    };
    
    const handleCheckOut = (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    }

    socket.on('booking:created', handleCreated);
    socket.on('booking:checked-in', handleCheckIn);
    socket.on('booking:cancelled', handleCancelled);
    socket.on('booking:checkout', handleCheckOut);

    return () => {
      socket.off('booking:created', handleCreated);
      socket.off('booking:checked-in', handleCheckIn);
      socket.off('booking:cancelled', handleCancelled);
      socket.off('booking:checkout', handleCheckOut);
    };
  }, [socket, queryClient]);
}

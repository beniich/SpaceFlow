import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { useOfflineQueue } from './useOfflineQueue';
import { Booking } from '../types/booking';
import { toast } from 'react-hot-toast';

export function useOfflineBookings(startDate: string, endDate: string) {
  const queryClient = useQueryClient();
  const { enqueue, pendingCount } = useOfflineQueue();

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['bookings-offline', startDate, endDate],
    queryFn: () => bookingService.list({
      startDate,
      endDate
    }).then(r => r.bookings || []),
    staleTime: 5 * 60 * 1000,
    networkMode: 'offlineFirst'
  });

  const createBooking = async (data: any) => {
    if (navigator.onLine) {
      try {
        const booking = await bookingService.create(data);
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['bookings-offline'] });
        return booking;
      } catch (err) {
        await enqueue({
          type: 'CREATE',
          endpoint: '/bookings',
          method: 'POST',
          body: data
        });
        toast.error('Hors ligne : réservation en attente de synchronisation', { icon: '📡' });
        return { id: 'temp-' + Date.now(), ...data, _offline: true };
      }
    } else {
      await enqueue({
        type: 'CREATE',
        endpoint: '/bookings',
        method: 'POST',
        body: data
      });
      toast.error('Hors ligne : réservation en attente de synchronisation', { icon: '📡' });
      return { id: 'temp-' + Date.now(), ...data, _offline: true };
    }
  };

  const cancelBooking = async (id: string) => {
    if (navigator.onLine) {
      try {
        await bookingService.cancel(id);
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['bookings-offline'] });
      } catch (err) {
        await enqueue({
          type: 'DELETE',
          endpoint: `/bookings/${id}/cancel`,
          method: 'POST'
        });
      }
    } else {
      await enqueue({
        type: 'DELETE',
        endpoint: `/bookings/${id}/cancel`,
        method: 'POST'
      });
    }
  };

  return {
    bookings: bookings as Booking[],
    isLoading,
    pendingCount,
    refetch,
    createBooking,
    cancelBooking
  };
}

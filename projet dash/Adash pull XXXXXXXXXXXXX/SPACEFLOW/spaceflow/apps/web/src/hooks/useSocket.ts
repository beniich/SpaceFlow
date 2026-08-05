import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

export function useSocket(token?: string) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
    });

    socket.on('booking:created', (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success(`Nouvelle réservation : ${data.reference}`);
    });

    socket.on('booking:cancelled', (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast(`Réservation annulée : ${data.reference}`, { icon: '❌' });
    });

    socket.on('booking:checkin', (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Check-in effectué');
    });

    socket.on('booking:checkout', () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, queryClient]);

  return socketRef.current;
}

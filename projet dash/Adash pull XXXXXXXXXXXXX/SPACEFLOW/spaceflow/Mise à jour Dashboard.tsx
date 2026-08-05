import { useState, useEffect } from 'react';
import { Building2, Users, Calendar, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { statsService } from '../services/statsService';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { TopSpaces } from '../components/dashboard/TopSpaces';
import { formatCurrency } from '../utils/format';

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => statsService.getKPIs()
  });

  const { data: revenue } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: () => statsService.getRevenueChart(6)
  });

  const { data: topSpaces } = useQuery({
    queryKey: ['top-spaces'],
    queryFn: () => statsService.getTopSpaces()
  });

  const { data: activity } = useQuery({
    queryKey: ['activity'],
    queryFn: () => statsService.getActivity(15)
  });

  if (kpisLoading) {
    return <div className="text-center py-12 text-slate-500">Chargement...</div>;
  }

  const stats = [
    {
      label: 'Espaces',
      value: kpis?.spaces?.total || 0,
      sub: 
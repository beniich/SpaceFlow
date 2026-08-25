/**
 * Helper de thème pour les graphiques (Recharts, Chart.js, etc.)
 * Respecte le mode clair (fond blanc, axes foncés) et mode sobre (fond noir, axes clairs).
 */
export function getChartTheme(isDark) {
  return {
    grid: isDark ? '#27272a' : '#e2e8f0',
    axis: isDark ? '#94a3b8' : '#475569',
    tooltip: {
      background: isDark ? '#000000' : '#ffffff',
      border: isDark ? '#27272a' : '#e2e8f0',
      text: isDark ? '#ffffff' : '#000000',
    },
    legend: isDark ? '#cbd5e1' : '#475569',
    series: [
      isDark ? '#00dbe7' : '#ff5500',
      isDark ? '#ff5500' : '#00dbe7',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
    ],
  };
}

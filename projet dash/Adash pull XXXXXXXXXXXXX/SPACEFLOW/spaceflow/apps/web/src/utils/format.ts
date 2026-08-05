/**
 * Formatage des montants en euros (input: centimes)
 */
export function formatCurrency(cents: number, currency = 'EUR', locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Formatage de date courte
 */
export function formatDate(date: string | Date, locale = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Formatage de date + heure
 */
export function formatDateTime(date: string | Date, locale = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Durée en heures formatée
 */
export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  if (hours === 1) return '1h';
  if (Number.isInteger(hours)) return `${hours}h`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h${m}` : `${h}h`;
}

import * as StoreReview from 'expo-store-review';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'app-ratings' });
const ACTION_COUNT_KEY = 'positive_action_count';
const HAS_REVIEWED_KEY = 'has_reviewed_app';
const THRESHOLD = 5;

/**
 * Incrémente le compteur d'actions positives (ex: intervention clôturée, ticket créé)
 * et déclenche la modale d'avis store native (App Store / Play Store) si éligible.
 */
export async function trackPositiveActionAndRequestReview(): Promise<void> {
  try {
    const hasReviewed = storage.getBoolean(HAS_REVIEWED_KEY) ?? false;
    if (hasReviewed) return;

    const currentCount = (storage.getNumber(ACTION_COUNT_KEY) ?? 0) + 1;
    storage.set(ACTION_COUNT_KEY, currentCount);

    if (currentCount >= THRESHOLD) {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
        storage.set(HAS_REVIEWED_KEY, true);
      }
    }
  } catch (error) {
    console.warn('[StoreReview] Erreur lors de la demande d avis:', error);
  }
}

/**
 * Feature: BIM
 * Point d'entrée du domaine BIM.
 * Re-exporte les composants, hooks et services du domaine.
 */

// Page principale BIM
export { default as BIMViewerPage } from '../../pages/BIMViewer';

// Composants BIM
export { default as ModelViewer3D } from '../../components/bim/ModelViewer3D';

// Hook unifié asset ↔ BIM via TanStack Query
export { useAssetFromBIM } from './hooks/useAssetFromBIM';

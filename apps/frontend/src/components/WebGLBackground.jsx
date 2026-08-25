import React from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Wrapper de rendu conditionnel pour les fonds animés WebGL / 3D
 * Masqué en mode clair pour garantir un fond blanc pur et des performances maximales.
 */
export function WebGLBackground({ children, className = '' }) {
  const { isDark } = useTheme();

  if (!isDark) {
    return null;
  }

  return (
    <div data-theme-bg="shader" className={`webgl-shader-background ${className}`}>
      {children}
    </div>
  );
}

export default WebGLBackground;

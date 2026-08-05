import { useRef, useState } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipe(options: SwipeOptions) {
  const { onSwipeLeft, onSwipeRight, threshold = 50 } = options;
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX.current;
    if (Math.abs(diffX) > 10) {
      setIsDragging(true);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX.current;
    
    if (Math.abs(diffX) >= threshold) {
      if (diffX > 0) onSwipeRight?.();
      else onSwipeLeft?.();
    }
    
    startX.current = null;
    setIsDragging(false);
  };

  return { onTouchStart, onTouchMove, onTouchEnd, isDragging };
}

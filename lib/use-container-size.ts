'use client';

import { useState, useEffect } from 'react';

export type ContainerSize = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';

const STORAGE_KEY = 'chatkit-demo-size-preference';
const DEFAULT_SIZE: ContainerSize = 'desktop';
const SIZE_ORDER: ContainerSize[] = ['mobile', 'tablet', 'desktop', 'fullscreen'];

export interface ContainerSizeState {
  size: ContainerSize;
  setSize: (size: ContainerSize) => void;
  cycleSize: () => void;
}

function getSavedSize(): ContainerSize {
  if (typeof window === 'undefined') {
    return DEFAULT_SIZE;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SIZE_ORDER.includes(saved as ContainerSize)) {
      return saved as ContainerSize;
    }
  } catch (error) {
    console.error('Failed to read container size from localStorage:', error);
  }

  return DEFAULT_SIZE;
}

function saveSize(size: ContainerSize): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, size);
  } catch (error) {
    console.error('Failed to save container size to localStorage:', error);
  }
}

export function useContainerSize(): ContainerSizeState {
  const [size, setSizeState] = useState<ContainerSize>(DEFAULT_SIZE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedSize = getSavedSize();
    setSizeState(savedSize);
    setIsInitialized(true);
  }, []);

  const setSize = (newSize: ContainerSize) => {
    setSizeState(newSize);
    if (isInitialized) {
      saveSize(newSize);
    }
  };

  const cycleSize = () => {
    const currentIndex = SIZE_ORDER.indexOf(size);
    const nextIndex = (currentIndex + 1) % SIZE_ORDER.length;
    setSize(SIZE_ORDER[nextIndex]);
  };

  return { size, setSize, cycleSize };
}

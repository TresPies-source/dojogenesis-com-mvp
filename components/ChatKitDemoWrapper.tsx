'use client';

import { ChatKitDemo } from '@/components/ChatKitDemo';
import { ContainerSizeSelector } from '@/components/ContainerSizeSelector';
import { useContainerSize } from '@/lib/use-container-size';

const SIZE_CLASSES = {
  mobile: 'max-w-sm',
  tablet: 'max-w-2xl',
  desktop: 'max-w-5xl',
  fullscreen: 'max-w-full',
};

export function ChatKitDemoWrapper() {
  const { size } = useContainerSize();

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-end items-center gap-3">
          <span className="text-sm text-muted-foreground">Container Size:</span>
          <ContainerSizeSelector />
        </div>
      </div>
      
      <div className={`${SIZE_CLASSES[size]} mx-auto`}>
        <ChatKitDemo />
      </div>
    </>
  );
}

'use client';

import { Hero } from '@/components/Hero';
import { ChatKitDemo } from '@/components/ChatKitDemo';
import { Footer } from '@/components/Footer';
import { ContainerSizeSelector } from '@/components/ContainerSizeSelector';
import { useContainerSize } from '@/lib/use-container-size';

const SIZE_CLASSES = {
  mobile: 'max-w-sm',
  tablet: 'max-w-2xl',
  desktop: 'max-w-5xl',
  fullscreen: 'max-w-full',
};

export default function Home() {
  const { size } = useContainerSize();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-end">
            <ContainerSizeSelector />
          </div>
        </div>
        
        <div className={`${SIZE_CLASSES[size]} mx-auto`}>
          <ChatKitDemo />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

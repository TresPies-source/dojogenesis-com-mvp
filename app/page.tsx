import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { ChatKitDemoWrapper } from '@/components/ChatKitDemoWrapper';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <ChatKitDemoWrapper />
      </main>
      
      <Footer />
    </div>
  );
}

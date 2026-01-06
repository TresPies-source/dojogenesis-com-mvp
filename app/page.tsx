import { Hero } from '@/components/Hero';
import { ChatKitDemo } from '@/components/ChatKitDemo';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <ChatKitDemo />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

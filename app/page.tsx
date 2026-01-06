import { ChatKitDemo } from '@/components/ChatKitDemo';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Dojo Genesis MVP</h1>
      <div className="max-w-4xl mx-auto">
        <ChatKitDemo />
      </div>
    </main>
  );
}

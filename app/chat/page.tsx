import Header from '@/components/layout/Header';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-sand-light flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-6 px-6 lg:px-8">
        <ChatInterface />
      </main>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DraggableModal } from '@/components/draggable-modal';
import { ChatWindow } from '@/components/chat-window';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">IA Jur</h1>
        <p className="text-lg text-gray-600 max-w-md">
          Seu assistente jurídico inteligente. Tire suas dúvidas legais com a ajuda da inteligência artificial.
        </p>
        <Button
          size="lg"
          onClick={() => setIsChatOpen(true)}
          className="text-lg px-8 py-6"
        >
          Abrir Chat Jurídico
        </Button>
      </div>

      <DraggableModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title="IA - Assistente Jurídico"
      >
        <ChatWindow />
      </DraggableModal>
    </div>
  );
}

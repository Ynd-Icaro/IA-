'use client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";

export function ChatWindow() {
  const { messages, sendMessage, status, error } = useChat({
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-lg">Bem-vindo ao IA Jur!</p>
            <p className="text-sm mt-2">Faça sua pergunta jurídica abaixo.</p>
          </div>
        )}
        {messages.map((message) => {
          const textParts = message.parts.filter((part) => part.type === 'text');
          const textContent = textParts.map((p) => p.text).join('');
          if (!textContent) return null;
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-wrap ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {textContent}
              </div>
            </div>
          );
        })}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-400">
              Pensando...
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-2 text-red-700 text-sm">
              Erro: {error.message}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex gap-2 items-end">
        <Textarea
          placeholder="Digite sua pergunta legal..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          value={input}
          rows={1}
          className="flex-1 resize-none"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? '...' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
}


export default ChatWindow;
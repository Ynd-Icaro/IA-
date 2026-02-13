'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function DraggableModal({ isOpen, onClose, title, children }: DraggableModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);

  // Center the modal on first open
  useEffect(() => {
    if (isOpen && !initialized) {
      const modalWidth = 420;
      const modalHeight = 520;
      setPosition({
        x: Math.max(0, (window.innerWidth - modalWidth) / 2),
        y: Math.max(0, (window.innerHeight - modalHeight) / 2),
      });
      setInitialized(true);
    }
    if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen, initialized]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag from the header area
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-drag]')) return;

    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed z-50 shadow-2xl rounded-lg border border-gray-200 bg-white flex flex-col overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: 420,
        height: 520,
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      {/* Draggable header */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white cursor-grab active:cursor-grabbing select-none shrink-0"
      >
        <span className="font-semibold text-sm">{title || 'Chat'}</span>
        <button
          data-no-drag
          onClick={onClose}
          className="p-1 hover:bg-blue-700 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

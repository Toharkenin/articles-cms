import { useEffect, useRef } from 'react';

export interface PopupProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Popup({ open, onClose, children, className }: PopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 bg-opacity-40">
      <div
        ref={popupRef}
        className={`bg-white rounded-xl shadow-lg p-6 max-w-lg w-full ${className || ''}`}
      >
        {children}
      </div>
    </div>
  );
}

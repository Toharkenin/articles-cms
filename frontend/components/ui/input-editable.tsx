'use client';

import { useEffect, useRef, useState } from 'react';

interface InlineEditableProps {
  value: string;
  onChange: (val: string) => void;
  onConfirm?: () => void;
  placeholder?: string;
}

export default function InlineEditable({
  value,
  onChange,
  onConfirm,
  placeholder = 'Enter title...',
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (!value.trim()) return;
    onConfirm?.();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleConfirm();
            }
          }}
          placeholder={placeholder}
          className="
            w-full rounded-xl border border-slate-200
            bg-white px-4 py-2.5 pr-10
            text-1xl font-light text-slate-900
            focus:ring-2 focus:ring-[#2B4A75]/25
            transition
          "
        />

        {value.trim() && (
          <button
            type="button"
            onClick={handleConfirm}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              h-5 w-5 rounded-full
              bg-green-500 text-white text-xs
              hover:bg-green-600
              transition
            "
          >
            ✓
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative bg-[#fafafa] rounded-lg px-2 py-1">
      <h1
        onClick={() => setIsEditing(true)}
        className="
        text-1xl font-semibold text-slate-900
        cursor-pointer rounded-lg px-2 py-1
        hover:bg-slate-50 transition
      "
      >
        {value}
      </h1>
    </div>
  );
}

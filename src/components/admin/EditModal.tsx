"use client";

import { useEffect, useRef } from "react";

interface EditModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  children: React.ReactNode;
}

export function EditModal({ open, title, onClose, onSave, saving, children }: EditModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={ref}
        className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-slideDown"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-10">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 text-xl leading-none">×</button>
        </div>
        <div className="px-4 py-4 space-y-3">
          {children}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 active:scale-95"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#2d5016] text-white text-sm font-medium disabled:opacity-50 active:scale-95"
          >
            {saving ? "..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}

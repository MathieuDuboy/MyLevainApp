"use client";

interface AdminCardProps {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}

export function AdminCard({ title, children, onAdd, addLabel = "+ Ajouter" }: AdminCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="font-semibold text-sm">{title}</h3>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="text-xs bg-[#2d5016] text-white px-3 py-1.5 rounded-lg font-medium active:scale-95 transition-transform"
          >
            {addLabel}
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

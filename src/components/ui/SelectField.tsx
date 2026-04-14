"use client";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: readonly string[] | SelectOption[];
  placeholder?: string;
}

export function SelectField({ label, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
      >
        <option value="">{placeholder || "Sélectionner..."}</option>
        {options.map((opt) => {
          if (typeof opt === "string") {
            return <option key={opt} value={opt}>{opt}</option>;
          }
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </div>
  );
}

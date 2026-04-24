'use client';

import { DateRange } from '@/lib/dateUtils';

const OPTIONS: { label: string; value: DateRange }[] = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'all' },
];

interface DateFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <div className="flex gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            value === opt.value
              ? 'bg-amber-500 text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

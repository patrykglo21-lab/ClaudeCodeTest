'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import MetricCard from '@/components/MetricCard';
import DateFilter from '@/components/DateFilter';
import { DateRange } from '@/lib/dateUtils';

interface Metrics {
  revenue: number;
  appointments: number;
  afterHours: number;
  calls: number;
}

export default function DashboardPage() {
  const [range, setRange] = useState<DateRange>('month');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/metrics?range=${range}`);
      if (!res.ok) throw new Error('Failed to fetch');
      setMetrics(await res.json());
    } catch {
      setError('Could not load metrics. Check your API keys.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const fmt = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main className="px-8 py-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">AI Receptionist Overview</h2>
            <p className="text-zinc-500 text-sm mt-1">Performance metrics powered by your AI</p>
          </div>
          <DateFilter value={range} onChange={setRange} />
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Revenue Generated"
            value={loading ? '—' : fmt(metrics?.revenue ?? 0)}
            sublabel="by AI bookings"
            accent="from-emerald-500 to-emerald-600"
            icon={<span>$</span>}
          />
          <MetricCard
            label="Appointments Booked"
            value={loading ? '—' : (metrics?.appointments ?? 0)}
            sublabel="booked by AI"
            accent="from-blue-500 to-blue-600"
            icon={<span>📅</span>}
          />
          <MetricCard
            label="After Hours Captured"
            value={loading ? '—' : (metrics?.afterHours ?? 0)}
            sublabel="bookings after hours"
            accent="from-violet-500 to-violet-600"
            icon={<span>🌙</span>}
          />
          <MetricCard
            label="Calls Handled"
            value={loading ? '—' : (metrics?.calls ?? 0)}
            sublabel="total AI calls"
            accent="from-amber-500 to-amber-600"
            icon={<span>📞</span>}
          />
        </div>
      </main>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  accent?: string;
}

export default function MetricCard({ label, value, sublabel, icon, accent = 'from-amber-500 to-amber-600' }: MetricCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{label}</p>
        <p className="text-4xl font-bold text-white mt-1">{value}</p>
        {sublabel && <p className="text-zinc-500 text-sm mt-1">{sublabel}</p>}
      </div>
    </div>
  );
}

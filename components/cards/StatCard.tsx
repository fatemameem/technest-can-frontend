interface StatCardProps {
  number: string;
  label: string;
  description: string;
}

export function StatCard({ number, label, description }: StatCardProps) {
  return (
    <div className="text-center p-6 surface rounded-2xl hover-lift">
      <div className="text-3xl lg:text-4xl font-bold text-cyan-400 mb-2">
        {number}
      </div>
      <div className="text-lg font-semibold mb-2">{label}</div>
      <div className="text-sm text-slate-400">{description}</div>
    </div>
  );
}
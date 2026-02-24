import { StatsCard } from '@/components/admin/states-card';

//todo: fetch real data from backend and pass to StatsCard

export default function DashboardPage() {
  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard title="TOTAL ARTICLES" value={0} color="bg-[#E63946]" />
        <StatsCard title="PUBLISHED" value={0} color="bg-[#457B9D]" />
        <StatsCard title="DRAFTS" value={0} color="bg-[#1D3557]" />
      </div>
    </div>
  );
}

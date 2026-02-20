export function StatsCard({ title, value, color }: { title: string; value: number; color: string }) {
	return (
		<div
			className={`relative rounded-2xl p-6 text-white overflow-hidden ${color}`}
		>
			<div className="relative z-10">
				<p className="text-sm tracking-wide opacity-90">{title}</p>
				<p className="text-4xl font-bold mt-3">{value}</p>
			</div>

			{/* Decorative circle */}
			<div className="absolute -top-6 -right-6 w-32 h-32 bg-white/20 rounded-full" />
		</div>
	);
}

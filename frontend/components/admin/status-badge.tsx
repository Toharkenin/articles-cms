export function StatusBadge({ status }: { status: "active" | "inactive" }) {
	const styles =
		status === "active"
			? "bg-green-100 text-green-700"
			: "bg-red-100 text-red-700";

	return (
		<span className={`px-3 py-1 rounded-md text-xs font-semibold ${styles}`}>
			{status === "active" ? "Active" : "Inactive"}
		</span>
	);
}
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold">Admin Area</h1>
      </nav>
      <main>{children}</main>
    </div>
  );
}

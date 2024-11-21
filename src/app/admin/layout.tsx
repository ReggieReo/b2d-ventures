import { Sidebar } from "~/components/browsing/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-[calc(100vh-64px)]">
      <div className="fixed inset-y-16 left-0 z-30 block md:block">
        <Sidebar />
      </div>
      <main className="md:pl-64">
        <div className="px-4 py-10 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-50">
      <Sidebar />
      <div className="pl-[260px] transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

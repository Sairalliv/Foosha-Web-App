import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="app">
      <Sidebar
        subtitle="City admin console"
        profileName="Mandaue City Hall"
        profileRole="Admin · Social Welfare Office"
        avatarInitials="CH"
        avatarTeal
        groups={[
          {
            label: "Operations",
            items: [
              { label: "Overview", to: "/admin", end: true },
              { label: "Matching queue", to: "/admin/queue" },
              { label: "All donations", to: "/admin/donations" },
              { label: "All requests", to: "/admin/requests" },
            ],
          },
          {
            label: "Insights",
            items: [
              { label: "Analytics", to: "/admin/analytics" },
              { label: "Reports & export", to: "/admin/reports" },
            ],
          },
          {
            label: "People",
            items: [{ label: "Verification", to: "/admin/verify" }],
          },
        ]}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

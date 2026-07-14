import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user } = useAuth();

  const profileName = user?.name ?? "Mandaue City Hall";
  const initials = user?.avatarInitials ?? "CH";

  return (
    <div className="app">
      <Sidebar
        subtitle="City admin console"
        profileName={profileName}
        profileRole={`Admin · ${user?.email ?? "Social Welfare Office"}`}
        avatarInitials={initials}
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

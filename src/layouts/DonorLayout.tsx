import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { CURRENT_DONOR } from "../data/seed";

export default function DonorLayout() {
  return (
    <div className="app">
      <Sidebar
        profileName={CURRENT_DONOR.name}
        profileRole={`Donor · Rank #${CURRENT_DONOR.cityRank}`}
        avatarInitials={CURRENT_DONOR.avatarInitials}
        groups={[
          {
            label: "Give",
            items: [
              { label: "Dashboard", to: "/donor", end: true },
              { label: "New donation", to: "/donor/new" },
              { label: "My donations", to: "/donor/history" },
              { label: "Badges & rank", to: "/donor/badges" },
            ],
          },
          {
            label: "Need help?",
            items: [{ label: "Request assistance", to: "/recipient" }],
          },
        ]}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

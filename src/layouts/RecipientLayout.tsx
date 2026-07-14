import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { CURRENT_RECIPIENT } from "../data/seed";

export default function RecipientLayout() {
  return (
    <div className="app">
      <Sidebar
        profileName={CURRENT_RECIPIENT.name}
        profileRole={`Recipient · Barangay ${CURRENT_RECIPIENT.barangay}`}
        avatarInitials={CURRENT_RECIPIENT.avatarInitials}
        avatarTeal
        groups={[
          {
            label: "Get help",
            items: [
              { label: "Home", to: "/recipient", end: true },
              { label: "Request help", to: "/recipient/request" },
              { label: "Browse available", to: "/recipient/browse" },
              { label: "Confirm pickup", to: "/recipient/confirm" },
              { label: "My requests", to: "/recipient/history" },
            ],
          },
          {
            label: "Want to give back?",
            items: [{ label: "Make a donation", to: "/donor" }],
          },
        ]}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

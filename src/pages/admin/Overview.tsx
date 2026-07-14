import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOverviewStats, listRequests } from "../../data/api";
import type { AdminOverviewStats, HelpRequest } from "../../data/types";
import { StatCard, PriorityTag, LoadingState } from "../../components/Shared";

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [priorityRequests, setPriorityRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminOverviewStats(), listRequests()]).then(([s, reqs]) => {
      setStats(s);
      setPriorityRequests(reqs.filter((r) => r.priorityTier !== "general" && r.status === "unmatched").slice(0, 4));
      setLoading(false);
    });
  }, []);

  if (loading || !stats) return <LoadingState />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">City-wide overview</div>
          <h1>Good morning, Social Welfare Office</h1>
          <p className="sub">Here's the state of the network across all barangays today.</p>
        </div>
        <Link to="/admin/queue" className="btn btn-primary">Go to matching queue</Link>
      </div>

      <div className="stat-row">
        <StatCard num={stats.pendingMatches} label="Pending matches" urgent />
        <StatCard num={stats.deliveredThisMonth} label="Delivered this month" />
        <StatCard num={`₱${(stats.totalValueDonatedPhp / 1000).toFixed(0)}K`} label="Total value donated" />
        <StatCard num={`${stats.confirmedWithin24hPct}%`} label="Confirmed within 24h" />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3>Priority queue</h3>
            <Link to="/admin/queue">Open queue</Link>
          </div>
          {priorityRequests.length === 0 ? (
            <p className="sub">No unmatched priority cases right now.</p>
          ) : (
            priorityRequests.map((r) => (
              <div className="priority-row row-item" key={r.id}>
                <div>
                  <div className="nm name">{r.recipientName} — Barangay {r.barangay}</div>
                  <div className="meta">Requesting: {r.description}</div>
                </div>
                <PriorityTag tier={r.priorityTier} />
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Recent activity</h3></div>
          <div className="activity-row row-item" style={{ display: "block" }}>
            <div>Ticket #MC-0298 confirmed by Lolo Vicente</div>
            <span style={{ color: "#6f8377", fontFamily: "var(--font-mono)", fontSize: 11 }}>2:14 PM · Barangay Basak</span>
          </div>
          <div className="activity-row row-item" style={{ display: "block" }}>
            <div>New request: ₱800 cash — P. Ramos household</div>
            <span style={{ color: "#6f8377", fontFamily: "var(--font-mono)", fontSize: 11 }}>1:47 PM · Barangay Basak</span>
          </div>
          <div className="activity-row row-item" style={{ display: "block", borderBottom: "none" }}>
            <div>Basak Sari-Sari Store donated rice, canned goods</div>
            <span style={{ color: "#6f8377", fontFamily: "var(--font-mono)", fontSize: 11 }}>1:20 PM · Barangay Basak</span>
          </div>
        </div>
      </div>
    </>
  );
}

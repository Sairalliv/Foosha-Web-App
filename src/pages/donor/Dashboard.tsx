import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDonations, getCurrentDonor } from "../../data/api";
import type { Donation, DonorProfile } from "../../data/types";
import { StatCard, StatusChip, LoadingState } from "../../components/Shared";
import { BADGES } from "../../data/seed";

export default function DonorDashboard() {
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCurrentDonor(), listDonations({ donorId: "donor-1" })]).then(([d, dons]) => {
      setDonor(d);
      setDonations(dons);
      setLoading(false);
    });
  }, []);

  if (loading || !donor) return <LoadingState />;

  const active = donations.filter((d) => d.status !== "confirmed").slice(0, 4);
  const awaitingCount = donations.filter((d) => d.status === "awaiting_pickup").length;
  const earnedBadges = BADGES.filter((b) => donor.badges.includes(b.id));
  const nextBadge = BADGES.find((b) => !donor.badges.includes(b.id) && b.thresholdMatches > donor.matchesCount);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Welcome back</div>
          <h1>Kamusta, {donor.name}</h1>
          <p className="sub">Here's what's happening with your giving this month.</p>
        </div>
        <Link to="/donor/new" className="btn btn-primary">+ New donation</Link>
      </div>

      <div className="stat-row">
        <StatCard num={donor.matchesCount} label="Matches this month" />
        <StatCard num={`₱${donor.totalGivenPhp.toLocaleString()}`} label="Total given" />
        <StatCard num={awaitingCount} label="Awaiting pickup" />
        <StatCard num={`#${donor.cityRank}`} label="City rank" />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3>Active pledges</h3>
            <Link to="/donor/history">View all</Link>
          </div>
          {active.length === 0 ? (
            <p className="sub">No active pledges right now — give something to get started.</p>
          ) : (
            active.map((d) => (
              <div className="row-item" key={d.id}>
                <div>
                  <div className="name">{d.description}</div>
                  <div className="meta">
                    {d.matchedRequestId ? `Ticket #${d.ticketId}` : "Waiting to be matched"}
                  </div>
                </div>
                <StatusChip status={d.status} />
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Your standing</h3></div>
          <div className="rank-card">
            <div className="rank-num">#{donor.cityRank}</div>
            <div className="rank-sub">Top donor in Barangay {donor.barangay}</div>
          </div>
          {nextBadge && (
            <>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, (donor.matchesCount / nextBadge.thresholdMatches) * 100)}%` }}
                />
              </div>
              <div className="progress-lbl" style={{ fontSize: 12, color: "var(--paper-dim)", display: "flex", justifyContent: "space-between" }}>
                <span>{donor.matchesCount} matches</span>
                <span>{nextBadge.thresholdMatches - donor.matchesCount} to "{nextBadge.name}"</span>
              </div>
            </>
          )}
          <div className="badge-row">
            {earnedBadges.map((b) => (
              <span className="badge earned" key={b.id}>{b.name}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

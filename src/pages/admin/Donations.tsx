import { useEffect, useState } from "react";
import { listDonations } from "../../data/api";
import type { Donation } from "../../data/types";
import { StatusChip, LoadingState, EmptyState } from "../../components/Shared";

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listDonations().then((d) => {
      setDonations(d);
      setLoading(false);
    });
  }, []);

  const filtered = donations.filter(
    (d) =>
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      (d.ticketId ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Records</div>
          <h1>All donations</h1>
          <p className="sub">Every food and cash donation submitted across the city.</p>
        </div>
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="Search donor or ticket…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No donations match your search." />
        ) : (
          <table>
            <thead><tr><th>Ticket</th><th>Donor</th><th>Given</th><th>Barangay</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="id-cell">{d.ticketId ?? "—"}</td>
                  <td>{d.donorName}</td>
                  <td>{d.description}</td>
                  <td>{d.barangay}</td>
                  <td>{d.createdAt}</td>
                  <td><StatusChip status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { listRequests } from "../../data/api";
import type { HelpRequest } from "../../data/types";
import { StatusChip, PriorityTag, LoadingState, EmptyState } from "../../components/Shared";

export default function AdminRequests() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listRequests().then((r) => {
      setRequests(r);
      setLoading(false);
    });
  }, []);

  const filtered = requests.filter(
    (r) =>
      r.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      (r.ticketId ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-head">
        <div>
          <div className="eyebrow">Records</div>
          <h1>All requests</h1>
          <p className="sub">Every request for help submitted across the city.</p>
        </div>
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="Search recipient or ticket…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No requests match your search." />
        ) : (
          <table>
            <thead><tr><th>Ticket</th><th>Recipient</th><th>Needs</th><th>Priority</th><th>Barangay</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="id-cell">{r.ticketId ?? "—"}</td>
                  <td>{r.recipientName}</td>
                  <td>{r.description}</td>
                  <td><PriorityTag tier={r.priorityTier} /></td>
                  <td>{r.barangay}</td>
                  <td><StatusChip status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

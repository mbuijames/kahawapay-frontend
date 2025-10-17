// src/components/TransactionsTable.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function TransactionsTable({
  transactions = [],
  filter = "all",
  onFilterChange = () => {},
  onMarkPaid = () => {},
  onArchive = () => {},
  loading = false,
  error = "",
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    // optional: console logs
  }, [transactions]);

  const visible = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (transactions || []).filter((t) => {
      const statusOk = filter === "all" ? true : (t.status || "").toLowerCase() === filter.toLowerCase();
      const email = (t.email || t.payer_email || "").toLowerCase();
      const msisdn = (t.msisdn || t.recipient_msisdn || "").toLowerCase();
      const searchOk = !q || email.includes(q) || msisdn.includes(q) || (q === "guest" && email.startsWith("guest-"));
      return statusOk && searchOk;
    });
  }, [transactions, filter, search]);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">Filter:</label>
        <select value={filter} onChange={(e) => onFilterChange(e.target.value)} className="border rounded px-2 py-1">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="archived">Archived</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-600">Search:</label>
          <input
            type="text"
            placeholder="Email or 'Guest'"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {loading && <div className="text-gray-600">Loading transactions…</div>}
      {error && !loading && <div className="text-red-600">{error}</div>}

      {!loading && !error && visible.length === 0 && (
        <div className="text-gray-500">
          No matching transactions found.
          <div className="text-xs text-gray-400 mt-1">
            Total loaded: {transactions?.length ?? 0} • Current filter: {filter} • Search: “{search}”
          </div>
          {transactions?.length > 0 && (
            <button
              className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded"
              onClick={() => {
                setSearch("");
                onFilterChange("all");
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <Th>ID</Th>
                <Th>Sender Email</Th>
                <Th>MSISDN</Th>
                <Th align="right">Amount (recipient)</Th>
                <Th>Currency</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.id} className="border-t">
                  <Td>{t.id}</Td>
                  <Td>{t.email || t.payer_email || ""}</Td>
                  <Td>{t.msisdn || t.recipient_msisdn || ""}</Td>
                  <Td align="right">{Number(t.amount_recipient ?? t.recipient_amount ?? 0).toFixed(2)}</Td>
                  <Td>{t.currency || "KES"}</Td>
                  <Td className="capitalize">{(t.status || "pending").toLowerCase()}</Td>
                  <Td>{t.created_at ? new Date(t.created_at).toLocaleString() : ""}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => onMarkPaid(t.id)}
                        disabled={(t.status || "").toLowerCase() === "paid"}
                      >
                        Mark Paid
                      </button>
                      <button
                        className="px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                        onClick={() => onArchive(t.id)}
                      >
                        Archive
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-sm text-gray-600 mt-2">
            Showing {visible.length} of {transactions?.length ?? 0}
          </div>
        </div>
      )}
    </section>
  );
}

function Th({ children, align = "left" }) {
  return <th className={`text-${align} text-sm font-semibold text-gray-700 px-3 py-2`}>{children}</th>;
}
function Td({ children, align = "left" }) {
  return <td className={`text-${align} px-3 py-2`}>{children}</td>;
}

// src/pages/Wallet.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE || "";

export default function Wallet() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email") || "Guest";
  const isGuest = !token;

  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      setRows([]);
      return;
    }
    loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cfg = () => ({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
    },
    params: { _ts: Date.now() },
  });

  const loadMine = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await axios.get(`${API_BASE}/api/wallet/mine`, cfg());
      const list = Array.isArray(data) ? data : [];
      setRows(list);
    } catch (e) {
      console.error("wallet/mine error:", e?.response?.status, e?.response?.data || e.message);
      setErr(e?.response?.data?.error || "Failed to load wallet. Please try again.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const symbols = { KES: "KSh", UGX: "UGX", TZS: "TSh", USD: "$" };
  const fmtAmt = (n) => Number(n ?? 0).toLocaleString();

  const downloadCSV = () => {
    if (!rows.length) return;
    const headers = ["Date", "Recipient Amount", "Currency", "Status", "MSISDN"];
    const lines = rows.map((t) => [
      t.created_at ? new Date(t.created_at).toLocaleString() : "",
      String(Number(t.recipient_amount ?? 0).toFixed(2)),
      t.currency || "",
      (t.status || "").toLowerCase(),
      t.recipient_msisdn || "",
    ]);
    const csv = [headers, ...lines].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallet_transactions.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">My Wallet</h1>

      {loading && <p className="text-gray-500">Loading wallet…</p>}
      {err && !loading && <p className="text-red-600 mb-3">{err}</p>}

      {!loading && isGuest && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          You’re viewing as a <b>Guest</b>. Please <b>login</b> to see your wallet.
        </div>
      )}

      {!loading && !err && !isGuest && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              Signed in as <b>{email}</b>
            </div>
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download CSV
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <Th>Date</Th>
                  <Th align="right">Recipient Amount</Th>
                  <Th>Currency</Th>
                  <Th>Status</Th>
                  <Th>MSISDN</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 border-b">
                    <Td>{t.created_at ? new Date(t.created_at).toLocaleString() : ""}</Td>
                    <Td align="right">
                      {(symbols[t.currency] || "")} {fmtAmt(Number(t.recipient_amount ?? 0).toFixed(2))}
                    </Td>
                    <Td>{t.currency || ""}</Td>
                    <Td className="capitalize">
                      {(t.status || "").toLowerCase() === "paid" ? "completed" : (t.status || "").toLowerCase()}
                    </Td>
                    <Td>{t.recipient_msisdn || ""}</Td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Th({ children, align = "left" }) {
  return <th className={`py-3 px-4 border-b text-${align} text-gray-700 font-semibold`}>{children}</th>;
}
function Td({ children, align = "left" }) {
  return <td className={`py-3 px-4 text-${align}`}>{children}</td>;
}

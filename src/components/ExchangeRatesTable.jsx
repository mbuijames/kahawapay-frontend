// src/components/ExchangeRatesTable.jsx
import React, { useEffect, useState } from "react";

/**
 * Renders existing exchange rates and allows adding/updating.
 * Expects parent to pass `onSave({ target_currency, rate })` which persists to backend.
 */
export default function ExchangeRatesTable({ rates = [], onSave }) {
  const [rows, setRows] = useState([]);
  const [newCur, setNewCur] = useState("");
  const [newRate, setNewRate] = useState("");
  const [err, setErr] = useState("");

  // Normalize a single API row to our table model
  const normalize = (r) => ({
    target: String(r.target_currency ?? r.currency ?? r.target ?? "").toUpperCase(),
    rate: Number(r.rate ?? r.value ?? 0),
    updated_at: r.updated_at ?? r.updatedAt ?? null,
  });

  useEffect(() => {
    setRows((rates || []).map(normalize).sort((a, b) => a.target.localeCompare(b.target)));
  }, [rates]);

  // Helpers
  const validCur = (s) => /^[A-Z]{3,10}$/.test(s);
  const toNumber = (v) => Number(String(v ?? "").replace(/,/g, "").trim()); // allow "117,000"

  const handleAdd = async () => {
    const target = newCur.trim().toUpperCase();
    const rateNum = toNumber(newRate);

    if (!validCur(target) || !Number.isFinite(rateNum) || rateNum <= 0) {
      setErr("Enter a valid currency (e.g., KES) and a positive numeric rate.");
      return;
    }
    setErr("");

    // DEBUG payload (remove later)
    console.log("➡️ onSave payload (add):", { target_currency: target, rate: rateNum });

    await onSave?.({ target_currency: target, rate: rateNum });

    // optimistic UI update (AdminPanel may also refetch)
    setRows((prev) => {
      const idx = prev.findIndex((x) => x.target === target);
      const updated = { target, rate: rateNum, updated_at: new Date().toISOString() };
      const copy = [...prev];
      if (idx >= 0) copy[idx] = updated;
      else copy.push(updated);
      copy.sort((a, b) => a.target.localeCompare(b.target));
      return copy;
    });

    setNewCur("");
    setNewRate("");
  };

  const handleRowSave = async (target, rate) => {
    const t = String(target || "").toUpperCase().trim();
    const r = toNumber(rate);

    if (!validCur(t) || !Number.isFinite(r) || r <= 0) {
      setErr("Enter a valid currency (3–10 letters) and a positive numeric rate.");
      return;
    }
    setErr("");

    console.log("➡️ onSave payload (edit):", { target_currency: t, rate: r });

    await onSave?.({ target_currency: t, rate: r });

    setRows((prev) => {
      const idx = prev.findIndex((x) => x.target === t);
      const copy = [...prev];
      const updated = { target: t, rate: r, updated_at: new Date().toISOString() };
      if (idx >= 0) copy[idx] = updated;
      else copy.push(updated);
      copy.sort((a, b) => a.target.localeCompare(b.target));
      return copy;
    });
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Exchange Rates (USD → Local)</h2>

      {err && <div className="text-red-600 text-sm">{err}</div>}
      {(!rows || rows.length === 0) && (
        <div className="text-gray-600">No rates configured yet. Add at least one (e.g., KES).</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <Th>Target</Th>
              <Th align="right">Rate</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <RateRow key={r.target} row={r} onSave={handleRowSave} />
            ))}

            {/* Inline Add Row */}
            <tr className="border-t">
              <Td>
                <input
                  value={newCur}
                  onChange={(e) =>
                    setNewCur(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
                  }
                  placeholder="KES"
                  className="border rounded px-2 py-1 w-24"
                />
              </Td>
              <Td align="right">
                <input
                  type="text"
                  inputMode="decimal"
                  value={newRate}
                  onChange={(e) =>
                    // allow digits & commas while typing; sanitize on save
                    setNewRate(e.target.value.replace(/[^0-9.,]/g, ""))
                  }
                  placeholder="129"
                  className="border rounded px-2 py-1 w-32 text-right"
                />
              </Td>
              <Td>—</Td>
              <Td>
                <button
                  className="px-3 py-1 text-sm text-white rounded bg-blue-600 hover:bg-blue-700"
                  onClick={handleAdd}
                >
                  Add
                </button>
              </Td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RateRow({ row, onSave }) {
  const [editing, setEditing] = useState(false);
  const [rate, setRate] = useState(row.rate);

  useEffect(() => setRate(row.rate), [row.rate]);

  const toNumber = (v) => Number(String(v ?? "").replace(/,/g, "").trim());

  const save = async () => {
    await onSave(row.target, toNumber(rate));
    setEditing(false);
  };

  return (
    <tr className="border-t">
      <Td>{row.target}</Td>
      <Td align="right">
        {editing ? (
          <input
            type="text"
            inputMode="decimal"
            value={String(rate)}
            onChange={(e) => setRate(e.target.value.replace(/[^0-9.,]/g, ""))}
            className="border rounded px-2 py-1 w-32 text-right"
          />
        ) : (
          Number(row.rate).toLocaleString(undefined, { maximumFractionDigits: 6 })
        )}
      </Td>
      <Td>{row.updated_at ? new Date(row.updated_at).toLocaleString() : "—"}</Td>
      <Td>
        {editing ? (
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded" onClick={save}>
              Save
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded"
              onClick={() => {
                setRate(row.rate);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="px-3 py-1 text-sm bg-gray-700 text-white rounded"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
      </Td>
    </tr>
  );
}

function Th({ children, align = "left" }) {
  return <th className={`text-${align} text-sm font-semibold text-gray-700 px-3 py-2`}>{children}</th>;
}
function Td({ children, align = "left" }) {
  return <td className={`text-${align} px-3 py-2`}>{children}</td>;
}

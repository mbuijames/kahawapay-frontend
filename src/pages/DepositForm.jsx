// src/pages/DepositForm.jsx
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { api, getDepositAddress, getCurrencies } from "../api";

export default function DepositForm() {
  const [depositAddress, setDepositAddress] = useState("");
  const [addrError, setAddrError] = useState("");

  const [currencies, setCurrencies] = useState([]);
  const [btcAmount, setBtcAmount] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [recipientMsisdn, setRecipientMsisdn] = useState("");

  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState(""); // 👈 new: inline preview error
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(""); // top-of-page generic errors
  const [successMsg, setSuccessMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");
  const storedEmail = localStorage.getItem("email") || "Guest";
  const isGuest = !token;

  // Guest limit for UX (real enforcement on backend)
  const GUEST_TX_LIMIT_USD = Number(import.meta.env?.VITE_GUEST_TX_LIMIT_USD);
  const GUEST_LIMIT = Number.isFinite(GUEST_TX_LIMIT_USD) ? GUEST_TX_LIMIT_USD : 100;

  // Separate endpoints
  const previewEndpoint = isGuest ? "/api/transactions/guest/preview" : "/api/transactions/preview";
  const createEndpoint  = isGuest ? "/api/transactions/guest"         : "/api/transactions";

  useEffect(() => {
    (async () => {
      // BTC deposit address
      try {
        const addr = await getDepositAddress();
        if (!addr?.address) {
          setDepositAddress("");
          setAddrError("Deposit address is not available.");
        } else {
          setDepositAddress(addr.address);
          setAddrError("");
        }
      } catch (e) {
        setDepositAddress("");
        setAddrError(e?.response?.data?.error || e?.message || "Failed to load deposit address.");
      }

      // Supported currencies
      try {
        const cur = await getCurrencies();
        const list = Array.isArray(cur?.currencies) && cur.currencies.length
          ? cur.currencies : ["KES", "UGX", "TZS"];
        setCurrencies(list);
        if (!list.includes(currency)) setCurrency(list[0]);
      } catch {
        const fallback = ["KES", "UGX", "TZS"];
        setCurrencies(fallback);
        if (!fallback.includes(currency)) setCurrency(fallback[0]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (!depositAddress) return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const normalizePreview = (data, fallback) => {
    const senderEmail =
      data?.payer || data?.payer_email || data?.email || data?.sender_email || storedEmail;

    // Prefer amount_recipient / recipient_amount; fall back to amount
    const amountRecipient =
      Number(data?.amount_recipient ?? data?.recipient_amount ?? data?.amount ?? 0) || 0;

    const msisdn = data?.recipient_msisdn ?? data?.msisdn ?? fallback?.recipient_msisdn ?? "";
    const cur = (data?.currency || fallback?.currency || currency) ?? "KES";

    // USD value (for guest limit UX)
    const usdValueRaw = data?.amount_usd ?? data?.usd_value ?? data?.usdValue;
    const usdValue = typeof usdValueRaw === "string" ? Number(usdValueRaw) : usdValueRaw;

    return {
      senderEmail,
      finalAmountLocal: amountRecipient,
      currency: cur,
      msisdn: String(msisdn),
      usdValue: Number.isFinite(usdValue) ? usdValue : undefined,
    };
  };

  // Turn server error into a clean message (avoid dumping HTML)
  const friendlyPreviewError = (res) => {
    try {
      if (!res) return "Failed to preview transaction";
      // If server gave a JSON error with a message, use it
      const serverMsg = res?.data?.error || res?.data?.message;
      if (serverMsg) return String(serverMsg);
      // If data is a string (likely HTML 404 page), sanitize
      if (typeof res?.data === "string") {
        if (res.data.includes("Cannot POST")) {
          return "Preview endpoint not found on server: /api/transactions/guest/preview";
        }
        if (res.data.includes("<!DOCTYPE html")) {
          return "Server returned an HTML error page for preview request";
        }
        return "Preview failed";
      }
      return "Failed to preview transaction";
    } catch {
      return "Failed to preview transaction";
    }
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    setPreview(null);
    setPreviewError("");

    try {
      const body = {
        amount_crypto_btc: Number(btcAmount),
        currency,
        recipient_msisdn: String(recipientMsisdn || "").replace(/\D/g, ""),
      };

      if (!body.amount_crypto_btc || body.amount_crypto_btc <= 0) {
        throw new Error("Enter a valid BTC amount greater than 0.");
      }
      if (!body.recipient_msisdn || body.recipient_msisdn.length !== 12) {
        throw new Error("Recipient phone must be 12 digits.");
      }

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // PREVIEW: expect 200 with JSON when under limit,
      // and 403 JSON when above limit.
      const res = await api.post(previewEndpoint, body, {
        headers,
        validateStatus: () => true, // 👈 let us handle 4xx manually
        params: { _ts: Date.now() },
      });

      if (res.status >= 400) {
        // Show inline error instead of dumping raw HTML
        const msg = friendlyPreviewError(res);
        setPreview(null);
        setPreviewError(msg);
        return;
      }

      setPreview(normalizePreview(res.data, body));
      setPreviewError("");
    } catch (err) {
      // Non-HTTP errors (network, code)
      setPreview(null);
      setPreviewError(err.message || "Failed to preview transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTransaction = async () => {
    if (!preview || submitting) return;
    setSuccessMsg("");
    setError("");
    setSubmitting(true);
    try {
      const body = {
        amount_crypto_btc: Number(btcAmount),
        currency,
        recipient_msisdn: String(recipientMsisdn || "").replace(/\D/g, ""),
      };
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // CREATE: writes to DB; backend still enforces any limits
      const res = await api.post(createEndpoint, body, {
        headers,
        validateStatus: (s) => s < 500,
        params: { _ts: Date.now() },
      });
      if (res.status >= 400) {
        const reason = res?.data?.error || res?.data?.details || "Failed to create transaction";
        throw new Error(reason);
      }

      // Stay on this page: clear preview & inputs, show success
      setPreview(null);
      setBtcAmount("");
      setRecipientMsisdn("");
      setSuccessMsg("✅ Transaction submitted. Awaiting admin approval.");
    } catch (err) {
      setError(err.message || "Failed to submit transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const formatLocal = (amount, cur) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
      Math.round(Number(amount || 0))
    ) + " " + cur;

  // Over-limit UI (only makes sense when we have a successful preview with usdValue)
  const overGuestLimit =
    isGuest && typeof preview?.usdValue === "number" && preview.usdValue > GUEST_LIMIT;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Send BTC Tip</h2>

      {isGuest && (
        <div className="mb-4 p-3 bg-yellow-100 border text-yellow-800 text-sm rounded">
          ⚠ Guests are limited to ${GUEST_LIMIT.toLocaleString()} per tip. Please <b>login</b> for higher limits.
        </div>
      )}

      {/* Success banner */}
      {successMsg && (
        <p className="mb-4 text-green-700 bg-green-50 border border-green-200 rounded p-3 text-center">
          {successMsg}
        </p>
      )}

      {/* Top-level errors (non-preview) */}
      {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

      {/* Deposit Address + QR */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Send BTC to (App Wallet Address)
        </label>
        <div className="bg-gray-100 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <code className="text-gray-800 break-all">
              {depositAddress || "Address unavailable"}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!depositAddress}
              className={`ml-2 px-3 py-1 text-sm text-white rounded ${
                depositAddress ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {addrError && <div className="mt-2 text-sm text-red-600">{addrError}</div>}
        </div>

        {depositAddress && (
          <div className="flex justify-center mt-4">
            <QRCode value={depositAddress} size={128} />
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handlePreview} className="space-y-4">
        <input
          type="number"
          placeholder="BTC Amount"
          step="0.00000001"
          value={btcAmount}
          onChange={(e) => setBtcAmount(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        <input
          type="tel"
          placeholder="Recipient Phone Number (12 digits)"
          value={recipientMsisdn}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 12);
            setRecipientMsisdn(v);
          }}
          pattern="\d{12}"
          maxLength={12}
          minLength={12}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          {loading ? "Calculating..." : "Review Recipient Amount"}
        </button>
      </form>

      {/* Preview success card */}
      {preview && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border text-center">
          <h3 className="text-lg font-semibold mb-2">Recipient will Receive</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatLocal(preview.finalAmountLocal, preview.currency)}
          </p>

          {/* If backend returned a preview over the limit and still provided usdValue, show inline warning */}
          {isGuest && overGuestLimit && (
            <p className="mt-2 text-sm text-red-600">
              Guests cannot exceed ${GUEST_LIMIT.toLocaleString()}
            </p>
          )}

          <div className="mt-2 text-sm text-gray-600">
            <div><b>Sender:</b> {preview.senderEmail}</div>
            <div><b>MSISDN:</b> {preview.msisdn}</div>
          </div>

          <button
            onClick={handleCompleteTransaction}
            disabled={!preview || overGuestLimit || submitting}
            className={`mt-4 px-5 py-2 rounded-md text-white ${
              overGuestLimit || submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting
              ? "Submitting..."
              : overGuestLimit
                ? `Limit Exceeded (Max $${GUEST_LIMIT.toLocaleString()})`
                : "Complete Transaction"}
          </button>
        </div>
      )}

      {/* Inline preview error card (appears when preview 4xx fails, e.g., over-limit 403 or missing route) */}
      {!preview && previewError && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 text-center">
          <h3 className="text-lg font-semibold mb-2 text-red-700">Preview Error</h3>
          <p className="text-sm text-red-700">{previewError}</p>
        </div>
      )}
    </div>
  );
}

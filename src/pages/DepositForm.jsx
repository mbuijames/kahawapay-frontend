// src/pages/DepositForm.jsx
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { api, getDepositAddress, getCurrencies } from "../api";
import { useNavigate } from "react-router-dom";

export default function DepositForm() {
  const [depositAddress, setDepositAddress] = useState("");
  const [addrError, setAddrError] = useState("");

  const [currencies, setCurrencies] = useState([]);
  const [btcAmount, setBtcAmount] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [recipientMsisdn, setRecipientMsisdn] = useState("");

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");
  const storedEmail = localStorage.getItem("email") || "Guest";
  const isGuest = !token;
  const navigate = useNavigate();

  // Fixed API paths (we rely on api.js baseURL)
  const endpoint = isGuest ? "/api/transactions/guest" : "/api/transactions";

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
        setAddrError(
          e?.response?.data?.error || e?.message || "Failed to load deposit address."
        );
      }

      // Currencies
      try {
        const cur = await getCurrencies(); // expected { currencies: ["KES","UGX","TZS", ...] }
        const list = Array.isArray(cur?.currencies) && cur.currencies.length
          ? cur.currencies
          : ["KES", "UGX", "TZS"];
        setCurrencies(list);
        // If current selection isn’t in list, switch to the first
        if (!list.includes(currency)) setCurrency(list[0]);
      } catch {
        const fallback = ["KES", "UGX", "TZS"];
        setCurrencies(fallback);
        if (!fallback.includes(currency)) setCurrency(fallback[0]);
      }
    })();
  }, []); // eslint-disable-line

  const handleCopy = () => {
    if (!depositAddress) return;
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const normalizeTxForPreview = (data, fallback) => {
    const senderEmail =
      data?.payer ||
      data?.payer_email ||
      data?.email ||
      data?.sender_email ||
      storedEmail;

    const amountRecipient =
      Number(
        data?.amount_recipient ??
          data?.recipient_amount ??
          data?.amount ??
          0
      ) || 0;

    const msisdn =
      data?.recipient_msisdn ?? data?.msisdn ?? fallback?.recipient_msisdn ?? "";

    const cur = data?.currency || fallback?.currency || currency;

    return {
      senderEmail,
      finalAmountLocal: amountRecipient,
      currency: cur,
      msisdn: String(msisdn),
    };
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPreview(null);

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

      const res = await api.post(endpoint, body, {
        headers,
        validateStatus: (s) => s < 500,
        params: { _ts: Date.now() },
      });

      if (res.status >= 400) {
        const reason = res?.data?.error || res?.data?.details || JSON.stringify(res?.data);
        console.error("❌ TX create failed:", res.status, reason);
        throw new Error(reason || "Failed to create transaction");
      }

      setPreview(normalizeTxForPreview(res.data, body));
    } catch (err) {
      setError(err.message || "Failed to preview transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTransaction = () => {
    if (!preview) return;
    alert("✅ Transaction submitted. Awaiting admin approval.");
    setPreview(null);
    setBtcAmount("");
    setRecipientMsisdn("");
    // Keep the chosen currency; remove this next line if you prefer to reset to KES:
    // setCurrency("KES");
    navigate("/"); // go to Home
  };

  const formatAmount = (amount, cur) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
      Math.round(Number(amount || 0))
    ) + " " + cur;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Send BTC Tip</h2>

      {isGuest && (
        <div className="mb-4 p-3 bg-yellow-100 border text-yellow-800 text-sm rounded">
          ⚠ Guests are limited to $10,000 per tip. Please <b>login</b> for higher limits.
        </div>
      )}

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

        {/* Recipient currency selector (NEW LABEL) */}
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

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

      {/* Preview */}
      {preview && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border text-center">
          <h3 className="text-lg font-semibold mb-2">Recipient will Receive</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatAmount(preview.finalAmountLocal, preview.currency)}
          </p>

          <div className="mt-2 text-sm text-gray-600">
            <div><b>Sender:</b> {preview.senderEmail}</div>
            <div><b>MSISDN:</b> {preview.msisdn}</div>
          </div>

          <button
            onClick={handleCompleteTransaction}
            disabled={!preview || (isGuest && Number(preview.finalAmountLocal) > 10000)}
            className={`mt-4 px-5 py-2 rounded-md text-white ${
              isGuest && Number(preview.finalAmountLocal) > 10000
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isGuest && Number(preview.finalAmountLocal) > 10000
              ? "Limit Exceeded (Login Required)"
              : "Complete Transaction"}
          </button>
        </div>
      )}
    </div>
  );
}

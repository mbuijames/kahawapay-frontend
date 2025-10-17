// src/utils/normalizeGuestTx.js
// Normalizes either the new guest-create response or older payloads
export function normalizeGuestTx(data = {}) {
  return {
    // sender email
    email:
      data.sender_email ??
      data.payer_email ??
      data.payer ??
      data.email ??
      "",

    // amount the recipient will receive (net)
    amount: Number(
      data.amount ??
      data.amount_recipient ??
      data.recipient_amount ??
      0
    ),

    // phone number
    msisdn:
      data.msisdn ??
      data.recipient_msisdn ??
      "",
  };
}

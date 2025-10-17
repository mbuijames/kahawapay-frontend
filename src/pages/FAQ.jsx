import React from "react";

export default function FAQ(){
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">FAQ</h1>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">How do I send a tip?</h3>
          <p>Go to the Send page, enter BTC amount and recipient phone, and confirm.</p>
        </div>
        <div>
          <h3 className="font-semibold">Do I need an account?</h3>
          <p>You can send as a guest (limited), or register for higher limits and a wallet.</p>
        </div>
        <div>
          <h3 className="font-semibold">Which currencies are supported?</h3>
          <p>See Admin &gt; Exchange Rates for currently configured currencies.</p>
        </div>
      </div>
    </div>
  );
}

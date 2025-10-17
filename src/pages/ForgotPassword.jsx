import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE || "";

export default function ForgotPassword(){
  const [email,setEmail] = useState("");
  const [msg,setMsg] = useState("");
  const [err,setErr] = useState("");

  const submit = async (e)=>{
    e.preventDefault();
    setMsg(""); setErr("");
    try{
      await axios.post(`${API_BASE}/api/auth/forgot`, { email });
      setMsg("If that email exists, a reset link has been sent.");
    }catch(e){
      setErr("Failed to request reset. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={submit} className="space-y-4">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
          placeholder="Email" required className="w-full border p-2 rounded"/>
        {msg && <p className="text-green-700">{msg}</p>}
        {err && <p className="text-red-600">{err}</p>}
        <button className="w-full btn-primary p-2 rounded">Send reset link</button>
      </form>
    </div>
  );
}

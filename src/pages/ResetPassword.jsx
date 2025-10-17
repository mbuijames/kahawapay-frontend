import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env?.VITE_API_BASE || "";

export default function ResetPassword(){
  const [token,setToken] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");
  const [err,setErr] = useState("");

  useEffect(()=>{
    const u = new URL(window.location.href);
    setToken(u.searchParams.get("token")||"");
  },[]);

  const submit = async (e)=>{
    e.preventDefault(); setMsg(""); setErr("");
    try{
      await axios.post(`${API_BASE}/api/auth/reset`, { token, password });
      setMsg("Password reset successful. You can now log in.");
    }catch(e){
      setErr(e?.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {!token && <p className="text-red-600 mb-2">Missing token in link.</p>}
      <form onSubmit={submit} className="space-y-4">
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
          placeholder="New password" required className="w-full border p-2 rounded"/>
        {msg && <p className="text-green-700">{msg}</p>}
        {err && <p className="text-red-600">{err}</p>}
        <button className="w-full btn-primary p-2 rounded" disabled={!token}>Reset</button>
      </form>
    </div>
  );
}

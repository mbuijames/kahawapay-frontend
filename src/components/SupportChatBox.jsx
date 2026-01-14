// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

import { logoutUser } from "./api";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wallet from "./pages/Wallet";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Settings from "./pages/Settings";
import DepositForm from "./pages/DepositForm.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import TwoFASetup from "./pages/TwoFASetup.jsx";
import TwoFAPrompt from "./pages/TwoFAPrompt.jsx";
import About from "./pages/About.jsx";
import FAQ from "./pages/FAQ.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";


// --- Inline route guards ---
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
function RequireAdmin({ children }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/wallet" replace />;
  return children;
}


function Shell({ user, setUser }) {
  const navigate = useNavigate();
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Nav */}
      <nav className="bg-white shadow mb-6">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">KahawaPay</h1>
          <div className="space-x-4">
            {!user && (
              <>
			  <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">Register</Link>
                <Link to="/send" className="text-gray-700 hover:text-blue-600 font-medium">Send</Link>
              </>
            )}

            {user && !isAdmin && (
              <>
                <Link to="/send" className="text-gray-700 hover:text-blue-600 font-medium">Send</Link>
                <Link to="/wallet" className="text-gray-700 hover:text-blue-600 font-medium">Wallet</Link>
				<Link to="/account" className="text-gray-700 hover:text-blue-600 font-medium">Account</Link>
              </>
            )}

            {isAdmin && (
				<>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin Panel</Link>
			   <Link to="/account" className="text-gray-700 hover:text-blue-600 font-medium">Account</Link>
			   </>
            )}

            {user && (
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
		
      {/* Routes */}
      <main className="flex-1 max-w-4xl mx-auto px-4">
        <Routes>
          {/* Default to /Home */}
          <Route path="/" element={<Home />} />

          {/* Public */}
          <Route path="/send" element={<DepositForm />} />
          <Route path="/deposit" element={<DepositForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/settings" element={<Settings />} />
		  <Route path="/forgot" element={<ForgotPassword />} />
		  <Route path="/reset" element={<ResetPassword />} />
		  <Route path="/2fa-setup" element={<RequireAuth><TwoFASetup/></RequireAuth>}/>
			<Route path="/2fa" element={<TwoFAPrompt setUser={setUser} />} />
			<Route path="/about" element={<About/>} />
			<Route path="/faq" element={<FAQ/>} />
			<Route path="/2fa" element={<TwoFAPrompt setUser={setUser} />} />
			<Route path="/account" element={<AccountSettings />} />

		  

          {/* Wallet → only for non-admin, signed-in users */}
          <Route
            path="/wallet"
            element={
              <RequireAuth>
                {isAdmin ? <Navigate to="/admin" replace /> : <Wallet />}
              </RequireAuth>
            }
          />

          {/* Admin → only for admins */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/send" replace />} />
        </Routes>
      </main>

      {/* Footer (hide for admin) */}
      {!isAdmin && (
        <footer className="p-4 bg-gray-100 text-center text-sm text-gray-600">
          <p>
            <a href="/terms" className="hover:underline">Terms of Service</a> |{" "}
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
          </p>
          <p className="mt-2">© {new Date().getFullYear()} KahawaPay</p>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    if (token && role) setUser({ token, role, email });
  }, []);

  return <Shell user={user} setUser={setUser} />;
} 
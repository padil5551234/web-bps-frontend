import React, { useState } from "react";
import bpslogo from "../assets/bps-logo.png"; // untuk akses ke gambar
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'; 

export default function LoginPage({ setCurrentPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginAction, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (!email || !password) {
      alert("Email dan password harus diisi!");
      return;
    }

    try {
      await loginAction(email, password);
      // Redirect ke publications setelah login berhasil
      navigate("/publications");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  function BpsLogo() {
    // react hanya bisa mengubah HTML via function
    return <img src={bpslogo} alt="BPS Logo" className="h-16 w-16" />;
  }

  const handleDemoLogin = () => {
    setEmail("admin@example.com");
    setPassword("123");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <BpsLogo />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 ${
                loading ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
              }`}
              placeholder="Masukkan email"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 ${
                loading ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
              }`}
              placeholder="Masukkan password"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 px-6 rounded-lg transition-colors duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-sky-700 hover:bg-sky-800 text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Demo Account Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <svg
              className="w-5 h-5 text-blue-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-sm font-semibold text-blue-800">Akun Demo</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-16">Email:</span>
              <span className="text-gray-800 font-mono bg-white px-2 py-1 rounded border">
                admin@example.com
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-16">Password:</span>
              <span className="text-gray-800 font-mono bg-white px-2 py-1 rounded border">
                123
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className={`mt-3 w-full text-sm font-medium py-2 px-4 rounded-md border border-blue-300 transition-colors duration-200 ${
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            }`}
          >
            Gunakan Akun Demo
          </button>
        </div>
      </div>
    </div>
  );
}
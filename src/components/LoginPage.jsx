import React, { useState } from "react";
import bpslogo from "../assets/bps-logo.png"; // untuk akses ke gambar
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'; 

export default function LoginPage({ setCurrentPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      alert("Semua field harus diisi!");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    // Simulasi registrasi (replace dengan logic registrasi yang sebenarnya)
    alert("Registrasi berhasil! Silakan login dengan akun baru Anda.");
    setIsLoginMode(true);
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  function BpsLogo() {
    return <img src={bpslogo} alt="BPS Logo" className="h-20 w-20" />;
  }

  const handleDemoLogin = () => {
    setEmail("admin@example.com");
    setPassword("123");
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail("");
    setPassword("");
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <BpsLogo />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {isLoginMode ? "Selamat Datang" : "Daftar Akun"}
            </h1>
            <p className="text-gray-600 text-center">
              {isLoginMode ? "Masuk ke akun Anda untuk melanjutkan" : "Buat akun baru untuk memulai"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLoginMode
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isLoginMode
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Login Form */}
          {isLoginMode ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 pl-12 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 ${
                        loading ? "bg-gray-50 cursor-not-allowed border-gray-200" : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="nama@email.com"
                      disabled={loading}
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 pl-12 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 ${
                        loading ? "bg-gray-50 cursor-not-allowed border-gray-200" : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Masukkan password"
                      disabled={loading}
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  <>
                    <span>Masuk</span>
                    <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300"
                      placeholder="Masukkan nama lengkap"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="reg-email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300"
                      placeholder="nama@email.com"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="reg-password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300"
                      placeholder="Minimal 6 karakter"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirm-password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 hover:border-gray-300"
                      placeholder="Ulangi password"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
              >
                <span>Daftar Sekarang</span>
                <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </form>
          )}

          {/* Demo Account Section - Only show in login mode */}
          {isLoginMode && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-blue-800">Akun Demo</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-blue-800 font-mono text-xs bg-blue-50 px-2 py-1 rounded">
                      admin@example.com
                    </span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Password:</span>
                    <span className="text-blue-800 font-mono text-xs bg-blue-50 px-2 py-1 rounded">
                      123
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className={`mt-4 w-full text-sm font-medium py-3 px-4 rounded-lg border-2 border-blue-200 transition-all duration-200 ${
                  loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <svg className="inline-block mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Gunakan Akun Demo
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              {isLoginMode ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {isLoginMode ? "Daftar sekarang" : "Masuk di sini"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
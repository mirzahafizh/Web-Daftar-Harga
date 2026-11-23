
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

import useAuthStore from '../stores/authStore';

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      window.location.href = '/dashboard';
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#002C5F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-32 -right-32 w-96 h-96 border-[50px] border-white rounded-full" />
          <div className="absolute -bottom-40 -left-32 w-[500px] h-[500px] border-[70px] border-white rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <span className="text-[#002C5F] font-black text-2xl">
                  H
                </span>
              </div>

              <div>
                <h1 className="font-bold text-xl">
                  HYUNDAI PARTS
                </h1>
                <p className="text-blue-200 text-xs tracking-[0.2em]">
                  PRICE MANAGEMENT SYSTEM
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-blue-100">
              <ShieldCheck size={16} />
              Administrator Portal
            </span>

            <h2 className="text-5xl font-bold leading-tight mt-8">
              Manage Your
              <span className="block text-blue-300">
                Hyundai Parts
              </span>
              With Confidence.
            </h2>

            <p className="text-blue-100 mt-6 leading-relaxed text-lg">
              Kelola informasi suku cadang, harga retail,
              kode diskon, dan perhitungan pajak dalam
              satu sistem terintegrasi.
            </p>
          </div>

          <p className="text-blue-200/70 text-sm">
            © {new Date().getFullYear()} Hyundai Parts Management.
            All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-[#002C5F] flex items-center justify-center">
              <span className="text-white font-black text-2xl">
                H
              </span>
            </div>

            <div>
              <h1 className="font-bold text-lg text-[#002C5F]">
                HYUNDAI PARTS
              </h1>
              <p className="text-slate-500 text-xs">
                PRICE MANAGEMENT SYSTEM
              </p>
            </div>
          </div>

          <div className="mb-9">
            <p className="text-sm font-semibold text-blue-700 mb-3">
              WELCOME BACK
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Admin Login
            </h2>

            <p className="text-slate-500 mt-3">
              Silakan masuk menggunakan akun administrator
              untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#002C5F] hover:bg-[#004080] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-900/10"
            >
              {loading ? 'Memproses...' : 'Sign In'}

              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Secure administrator authentication
          </div>
        </div>
      </div>
    </div>
  );
}

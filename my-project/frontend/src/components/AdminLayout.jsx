
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  CarFront,
  Percent,
} from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../stores/authStore';

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Spare Part',
      path: '/spare-parts',
      icon: Package,
    },
    {
      name: 'Pengaturan Diskon',
      path: '/discount-codes',
      icon: Percent,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#002C5F] text-white p-2 rounded-lg">
            <CarFront size={22} />
          </div>

          <span className="font-bold text-[#002C5F]">
            Hyundai Parts
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100"
          aria-label={sidebarOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#002C5F] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-white/10 p-2.5 rounded-xl">
            <CarFront size={25} />
          </div>

          <div>
            <h1 className="font-bold text-lg">Hyundai Parts</h1>
            <p className="text-xs text-blue-200">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-7">
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300 px-3 mb-4">
            Menu Utama
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      isActive
                        ? 'bg-white text-[#002C5F] font-semibold shadow-lg'
                        : 'text-blue-100 hover:bg-white/10'
                    }`
                  }
                >
                  <Icon size={19} />
                  <span className="text-sm">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-bold">
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.name || 'Administrator'}
              </p>

              <p className="text-xs text-blue-200">
                Administrator
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-sm text-blue-100 hover:bg-red-500 hover:text-white transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-20 lg:pt-0">
        {/* Topbar */}
        <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 px-8 items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              Sistem Manajemen Spare Part
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Hyundai Parts Management System
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-700">
              {user?.name || 'Administrator'}
            </p>

            <p className="text-xs text-slate-400">
              Admin
            </p>
          </div>
        </header>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, LogOut, ChevronLeft } from "lucide-react";
import logo from "@/assets/panjab-organic-logo.png";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/coupons", icon: Tag, label: "Coupons" },
];

export default function AdminLayout() {
  const { user, loading, logout, checkAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Re-check auth when admin layout mounts
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user && user.role !== "admin") navigate("/");
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;
  if (user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 shrink-0 hidden md:block">
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Panjab Organic" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-bold text-sm" style={{ fontFamily: 'Outfit' }}>Panjab Organic</span>
          </Link>
          <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-[#dcfce7] text-[#16a34a] font-medium" : "text-slate-600 hover:bg-gray-50"}`}
                data-testid={`admin-nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 mt-auto border-t border-gray-100">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700">
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </Link>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-600 w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile admin nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <Link to="/" className="text-sm text-slate-500"><ChevronLeft className="w-4 h-4 inline" /> Store</Link>
          <span className="font-bold text-sm" style={{ fontFamily: 'Outfit' }}>Admin</span>
          <button onClick={logout} className="text-sm text-red-500">Logout</button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap ${active ? "bg-[#16a34a] text-white" : "bg-gray-100 text-slate-600"}`}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8 mt-20 md:mt-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

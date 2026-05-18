import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [productsRes, ordersRes, profilesRes] = await Promise.all([
          supabase.from('products').select('id, name, price, images, stock, views, cart_adds'),
          supabase.from('orders').select('id, total, status, user_id, created_at, payment_intent_id'),
          supabase.from('profiles').select('id, email')
        ]);

        const products = productsRes.data || [];
        const orders = ordersRes.data || [];
        const profiles = profilesRes.data || [];

        const users = profiles.filter(p => p.id);

        const recent_orders = orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map(o => ({
            id: o.id,
            total: o.total,
            status: o.status,
            user_email: users.find(u => u.id === o.user_id)?.email || 'N/A'
          }));

        const top_products = products
          .sort((a, b) => (b.views + b.cart_adds) - (a.views + a.cart_adds))
          .slice(0, 4);

        const low_stock = products.filter(p => p.stock > 0 && p.stock < 20);

        setData({
          total_revenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
          total_orders: orders.length,
          total_users: users.length,
          total_products: products.length,
          recent_orders,
          top_products,
          low_stock
        });
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;
  if (!data) return <p className="text-center text-slate-400 py-10">Failed to load dashboard</p>;

  const stats = [
    { label: "Total Revenue", value: `$${data.total_revenue.toFixed(2)}`, icon: DollarSign, color: "#16a34a" },
    { label: "Total Orders", value: data.total_orders, icon: ShoppingCart, color: "#ff6a3d" },
    { label: "Total Customers", value: data.total_users, icon: Users, color: "#3b82f6" },
    { label: "Total Products", value: data.total_products, icon: Package, color: "#8b5cf6" },
  ];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Outfit' }}>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" data-testid={`stat-${s.label.toLowerCase().replace(/ /g, '-')}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Outfit' }}>Recent Orders</h3>
          {data.recent_orders.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {data.recent_orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-900">#{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500">{o.user_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${o.total?.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
            <TrendingUp className="w-4 h-4 text-[#16a34a]" /> Top Products
          </h3>
          <div className="space-y-3">
            {data.top_products.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl">
                <span className="text-sm font-bold text-slate-400 w-6">{i + 1}</span>
                <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.views} views | {p.cart_adds} cart adds</p>
                </div>
                <span className="text-sm font-semibold">${p.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        {data.low_stock.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Alert
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.low_stock.map((p) => (
                <div key={p.id} className="p-3 bg-amber-50 rounded-xl">
                  <p className="text-sm font-medium text-slate-900 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-amber-600 font-medium mt-1">Only {p.stock} left</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
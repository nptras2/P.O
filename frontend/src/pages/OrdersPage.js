import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Package, ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/auth"); return; }
    if (user) {
      const fetchOrders = async () => {
        const { data } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setOrders(data || []);
        setLoading(false);
      };
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="orders-page">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8" style={{ fontFamily: 'Outfit' }}>My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h2>
          <p className="text-slate-500 mb-6">Start shopping to see your orders here.</p>
          <Link to="/products" className="bg-[#16a34a] text-white rounded-xl px-6 py-3 font-medium hover:bg-[#15803d] transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              data-testid={`order-${order.id}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">Order #{order.id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-slate-900">${order.total?.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {order.order_items?.slice(0, 4).map((item, j) => (
                  <img key={j} src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0" />
                ))}
                {order.order_items?.length > 4 && <span className="text-xs text-slate-400 shrink-0">+{order.order_items.length - 4} more</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
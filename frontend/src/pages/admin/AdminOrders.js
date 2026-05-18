import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = async (status = "") => {
    setLoading(true);
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(filterStatus); }, [filterStatus]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(filterStatus);
    } catch { toast.error("Failed to update"); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;

  return (
    <div data-testid="admin-orders">
      <h1 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Outfit' }}>Orders</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setFilterStatus("")} className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-medium ${!filterStatus ? "bg-[#16a34a] text-white" : "bg-gray-100 text-slate-600"}`} data-testid="filter-all-orders">All</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-medium capitalize ${filterStatus === s ? "bg-[#16a34a] text-white" : "bg-gray-100 text-slate-600"}`} data-testid={`filter-order-${s}`}>{s}</button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-slate-400 py-10">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" data-testid={`admin-order-${order.id}`}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  <span className="font-bold text-slate-900">${order.total?.toFixed(2)}</span>
                </div>
              </div>
              {/* Items */}
              <div className="flex flex-wrap gap-2 mb-3">
                {order.order_items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#F9FAFB] rounded-lg px-2 py-1">
                    <img src={item.product_image} alt={item.product_name} className="w-8 h-8 rounded object-cover" />
                    <span className="text-xs text-slate-600">{item.product_name} x{item.quantity}</span>
                  </div>
                ))}
              </div>
              {/* Address */}
              {order.shipping_address && <p className="text-xs text-slate-500 mb-3">Ship to: {order.shipping_address} {order.shipping_city} {order.shipping_zip}</p>}
              {/* Status Update */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Update status:</span>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                  data-testid={`update-status-${order.id}`}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
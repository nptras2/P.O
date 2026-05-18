import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Mail, Package } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setCustomers(data || []);
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;

  return (
    <div data-testid="admin-customers">
      <h1 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Outfit' }}>Customers ({customers.length})</h1>
      {customers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400">No customers yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9FAFB] border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Orders</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.full_name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-slate-900">{c.full_name || "User"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.email || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phone || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-slate-600"><Package className="w-3 h-3" /> 0</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
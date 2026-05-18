import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Save, Tag } from "lucide-react";
import { toast } from "sonner";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ code: "", discount: "", min_cart_total: "0", expires_at: "" });

  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const resetForm = () => {
    setForm({ code: "", discount: "", min_cart_total: "0", expires_at: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (c) => {
    setForm({ code: c.code, discount: String(c.discount), min_cart_total: String(c.min_cart_total), expires_at: c.expires_at || "" });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      toast.success("Deleted");
      fetchCoupons();
    } catch { toast.error("Failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { code: form.code.toUpperCase(), discount: parseFloat(form.discount), min_cart_total: parseFloat(form.min_cart_total), expires_at: form.expires_at || null };
    try {
      if (editId) {
        const { error } = await supabase.from('coupons').update(payload).eq('id', editId);
        if (error) throw error;
        toast.success("Updated");
      } else {
        const { error } = await supabase.from('coupons').insert(payload);
        if (error) throw error;
        toast.success("Created");
      }
      resetForm();
      fetchCoupons();
    } catch (err) { toast.error(err.message || "Failed"); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;

  return (
    <div data-testid="admin-coupons">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Coupons</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#16a34a] text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-[#15803d] flex items-center gap-2" data-testid="add-coupon-btn">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={resetForm}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Outfit' }}>{editId ? "Edit Coupon" : "Create Coupon"}</h3>
              <button onClick={resetForm}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Coupon code (e.g. SAVE10)" required className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm uppercase" data-testid="coupon-code-input" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="Discount $" type="number" step="0.01" required className="px-3 py-2 rounded-xl border border-gray-200 text-sm" data-testid="coupon-value-input" />
                <input value={form.min_cart_total} onChange={(e) => setForm({ ...form, min_cart_total: e.target.value })} placeholder="Min order $" type="number" step="0.01" className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
              </div>
              <input value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} placeholder="Expires at (ISO date)" type="datetime-local" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
              <button type="submit" className="w-full bg-[#16a34a] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#15803d] flex items-center justify-center gap-2" data-testid="save-coupon-btn">
                <Save className="w-4 h-4" /> {editId ? "Update" : "Create"} Coupon
              </button>
            </form>
          </div>
        </div>
      )}

      {coupons.length === 0 ? (
        <div className="text-center py-16">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400">No coupons yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between" data-testid={`coupon-${c.id}`}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-bold text-[#16a34a] tracking-wider">{c.code}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
                </div>
                <p className="text-sm text-slate-500">
                  ${c.discount} off
                  {c.min_cart_total > 0 && ` | Min order: $${c.min_cart_total}`}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(c)} className="p-2 hover:bg-gray-100 rounded-lg text-slate-500"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
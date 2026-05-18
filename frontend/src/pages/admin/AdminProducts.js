import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["fruits", "vegetables", "dairy", "grains", "spices", "beverages", "snacks", "oils"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", discount: "0", category: "fruits", images: "", stock: "", unit: "kg", featured: false });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", discount: "0", category: "fruits", images: "", stock: "", unit: "kg", featured: false });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: String(p.price), discount: String(p.discount), category: p.category, images: (p.images || []).join(", "), stock: String(p.stock), unit: p.unit, featured: p.featured });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success("Product deleted");
      fetchProducts();
    } catch { toast.error("Failed to delete"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      discount: parseFloat(form.discount),
      category: form.category,
      images: form.images.split(",").map(s => s.trim()).filter(Boolean),
      stock: parseInt(form.stock),
      unit: form.unit,
      featured: form.featured,
    };
    try {
      if (editId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editId);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast.success("Product created");
      }
      resetForm();
      fetchProducts();
    } catch (err) { toast.error(err.message || "Failed"); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;

  return (
    <div data-testid="admin-products">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Products ({products.length})</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#16a34a] text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-[#15803d] flex items-center gap-2" data-testid="add-product-btn">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={resetForm}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Outfit' }}>{editId ? "Edit Product" : "Add Product"}</h3>
              <button onClick={resetForm}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" required className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" data-testid="product-name-input" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" step="0.01" required className="px-3 py-2 rounded-xl border border-gray-200 text-sm" data-testid="product-price-input" />
                <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="Discount %" type="number" className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 rounded-xl border border-gray-200 text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Unit (kg, piece)" className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
              </div>
              <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock quantity" type="number" required className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" data-testid="product-stock-input" />
              <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="Image URLs (comma separated)" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded text-[#16a34a]" />
                Featured product
              </label>
              <button type="submit" className="w-full bg-[#16a34a] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#15803d] flex items-center justify-center gap-2" data-testid="save-product-btn">
                <Save className="w-4 h-4" /> {editId ? "Update" : "Create"} Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB] border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Product</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Category</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Price</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Stock</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50" data-testid={`admin-product-row-${p.id}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-slate-900 line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium">${p.price}</span>
                    {p.discount > 0 && <span className="text-xs text-[#ff6a3d] ml-1">-{p.discount}%</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.stock === 0 ? "bg-red-100 text-red-700" : p.stock < 20 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(p)} className="p-2 hover:bg-gray-100 rounded-lg text-slate-500" data-testid={`edit-product-${p.id}`}><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400" data-testid={`delete-product-${p.id}`}><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
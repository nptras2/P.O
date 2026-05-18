import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const CATEGORIES = [
  { id: "fruits", name: "Fruits" },
  { id: "vegetables", name: "Vegetables" },
  { id: "dairy", name: "Dairy & Eggs" },
  { id: "grains", name: "Grains & Cereals" },
  { id: "spices", name: "Spices & Herbs" },
  { id: "beverages", name: "Beverages" },
  { id: "snacks", name: "Snacks & Dry Fruits" },
  { id: "oils", name: "Oils & Ghee" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const inStock = searchParams.get("in_stock") === "true";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*', { count: 'exact' });
        
        if (category) query = query.eq('category', category);
        if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        if (inStock) query = query.gt('stock', 0);
        
        // Sorting
        if (sort === "newest") query = query.order('created_at', { ascending: false });
        else if (sort === "price_asc") query = query.order('price', { ascending: true });
        else if (sort === "price_desc") query = query.order('price', { ascending: false });
        else if (sort === "popular") query = query.order('views', { ascending: false });
        
        query = query.range((page - 1) * 20, page * 20 - 1);
        
        const { data, count } = await query;
        setProducts(data || []);
        setTotal(count || 0);
      } catch { /* */ }
      setLoading(false);
    };
    fetchProducts();
  }, [category, search, sort, page, inStock]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="products-page">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">
          {category ? CATEGORIES.find(c => c.id === category)?.name || "Products" : search ? `Search: "${search}"` : "All Products"}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>
          {category ? CATEGORIES.find(c => c.id === category)?.name : search ? `Results for "${search}"` : "All Products"}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{total} products</span>
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-1 text-sm bg-gray-100 px-3 py-2 rounded-xl" data-testid="filter-toggle-btn">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"} md:block md:static md:w-56 shrink-0`}>
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h3 className="font-bold text-lg">Filters</h3>
            <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Outfit' }}>Category</h4>
            <div className="space-y-1">
              <button
                onClick={() => updateParam("category", "")}
                className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${!category ? "bg-[#dcfce7] text-[#16a34a] font-medium" : "text-slate-600 hover:bg-gray-50"}`}
                data-testid="filter-all-categories"
              >
                All Categories
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => updateParam("category", c.id)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${category === c.id ? "bg-[#dcfce7] text-[#16a34a] font-medium" : "text-slate-600 hover:bg-gray-50"}`}
                  data-testid={`filter-category-${c.id}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Outfit' }}>Availability</h4>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateParam("in_stock", e.target.checked ? "true" : "")}
                className="rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]"
                data-testid="filter-in-stock"
              />
              In Stock Only
            </label>
          </div>

          {/* Sort (mobile) */}
          <div className="md:hidden mb-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Sort By</h4>
            {SORT_OPTIONS.map(s => (
              <button key={s.value} onClick={() => { updateParam("sort", s.value); setShowFilters(false); }}
                className={`block w-full text-left text-sm px-3 py-2 rounded-xl ${sort === s.value ? "bg-[#dcfce7] text-[#16a34a] font-medium" : "text-slate-600"}`}>
                {s.label}
              </button>
            ))}
          </div>

          <button onClick={() => setShowFilters(false)} className="md:hidden w-full bg-[#16a34a] text-white rounded-xl py-3 font-medium text-sm">
            Apply Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort bar (desktop) */}
          <div className="hidden md:flex items-center justify-end gap-3 mb-6">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none"
              data-testid="sort-select"
            >
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-5 bg-gray-100 rounded w-1/4" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium text-slate-400">No products found</p>
              <Link to="/products" className="mt-4 inline-block text-sm text-[#16a34a] font-medium hover:underline">Browse all products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
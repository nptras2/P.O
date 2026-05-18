import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/auth"); return; }
    if (user) {
      const fetchWishlist = async () => {
        const { data } = await supabase
          .from('wishlist')
          .select('*, products(*)')
          .eq('user_id', user.id);
        const products = (data || []).map(item => item.products).filter(Boolean);
        setItems(products);
        setLoading(false);
      };
      fetchWishlist();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-[#16a34a] border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="wishlist-page">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8" style={{ fontFamily: 'Outfit' }}>My Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Save your favorite products here.</p>
          <Link to="/products" className="bg-[#16a34a] text-white rounded-xl px-6 py-3 font-medium hover:bg-[#15803d] transition-colors">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, i) => <ProductCard key={item.id} product={item} index={i} />)}
        </div>
      )}
    </div>
  );
}
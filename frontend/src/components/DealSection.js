import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Tag } from "lucide-react";

export default function DealSection() {
  const [deals, setDeals] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const [{ data: dealsData }, { data: featuredData }] = await Promise.all([
        supabase.from('products').select('*').gt('discount', 0).order('discount', { ascending: false }).limit(4),
        supabase.from('products').select('*').eq('featured', true).limit(8)
      ]);
      setDeals(dealsData || []);
      setFeatured(featuredData || []);
    };
    fetchProducts();
  }, []);

  return (
    <>
      {/* Deal of the Day */}
      {deals.length > 0 && (
        <section className="py-12 md:py-20 bg-[#fff7ed]" data-testid="deal-of-day-section">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#ff6a3d]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6a3d]">Limited Time</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Deal of the Day</h2>
              </div>
              <Link to="/products" className="text-sm text-[#ff6a3d] font-medium flex items-center gap-1 hover:underline" data-testid="view-all-deals-link">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {deals.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured / Deal of the Month */}
      {featured.length > 0 && (
        <section className="py-12 md:py-20" data-testid="deal-of-month-section">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-[#16a34a]" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a]">Popular Picks</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Deal of the Month</h2>
              </div>
              <Link to="/products" className="text-sm text-[#16a34a] font-medium flex items-center gap-1 hover:underline" data-testid="view-all-products-link">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.slice(0, 8).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
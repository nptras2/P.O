import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Apple, Carrot, Milk, Wheat, Flame, Coffee, Cookie, Droplets } from "lucide-react";

const CATEGORIES = [
  { id: "fruits", name: "Fruits", icon: "Apple" },
  { id: "vegetables", name: "Vegetables", icon: "Carrot" },
  { id: "dairy", name: "Dairy", icon: "Milk" },
  { id: "grains", name: "Grains", icon: "Wheat" },
  { id: "spices", name: "Spices", icon: "Flame" },
  { id: "beverages", name: "Beverages", icon: "Coffee" },
  { id: "snacks", name: "Snacks", icon: "Cookie" },
  { id: "oils", name: "Oils", icon: "Droplets" },
];

const iconMap = { Apple, Carrot, Milk, Wheat, Flame, Coffee, Cookie, Droplets };

export default function CategorySection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('products').select('category');
      const categoryCounts = {};
      data?.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      });
      setCategories(CATEGORIES.map(c => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        count: categoryCounts[c.id] || 0
      })));
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-12 md:py-16" data-testid="category-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-6 md:overflow-visible">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Apple;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/products?category=${cat.id}`}
                  className="flex flex-col items-center gap-2 min-w-[80px] group"
                  data-testid={`category-${cat.id}`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-[#dcfce7] rounded-2xl flex items-center justify-center group-hover:bg-[#16a34a] transition-colors duration-300">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-[#16a34a] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 text-center whitespace-nowrap">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">{cat.count} items</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
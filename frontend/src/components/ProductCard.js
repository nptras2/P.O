import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const effectivePrice = product.price * (1 - (product.discount || 0) / 100);
  const isLowStock = product.stock > 0 && product.stock < 20;
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white border border-gray-50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
      data-testid={`product-card-${product.slug}`}
    >
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#ff6a3d] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
        {isLowStock && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Low Stock
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </Link>
      <div className="p-4">
        <p className="text-xs text-[#16a34a] font-semibold uppercase tracking-wide mb-1">{product.category}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm text-slate-900 line-clamp-2 hover:text-[#16a34a] transition-colors mb-2" style={{ fontFamily: 'Outfit' }}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-[#0f172a]">${effectivePrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-slate-400 line-through">${product.price.toFixed(2)}</span>
          )}
          <span className="text-xs text-slate-400">/ {product.unit}</span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          disabled={isOutOfStock}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#16a34a] text-white hover:bg-[#15803d]"}`}
          data-testid={`add-to-cart-${product.slug}`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingCart, Star, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [{ data: productData }, { data: relatedData }] = await Promise.all([
          supabase.from('products').select('*').eq('slug', slug).single(),
          supabase.from('products').select('*').neq('slug', slug).limit(4)
        ]);
        setProduct(productData);
        setRelated(relatedData || []);
        setSelectedImage(0);
        setQuantity(1);

        if (productData) {
          // Fetch reviews
          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productData.id);
          setReviews(reviewsData || []);
          if (reviewsData?.length) {
            const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
            setAvgRating(avg);
          } else {
            setAvgRating(0);
          }

          // Check wishlist
          if (user) {
            const { data: wl } = await supabase
              .from('wishlist')
              .select('id')
              .eq('user_id', user.id)
              .eq('product_id', productData.id)
              .single();
            setInWishlist(!!wl);
          }
        }
      } catch { /* */ }
      setLoading(false);
    };
    fetch();
  }, [slug, user]);

  const toggleWishlist = async () => {
    if (!user) { toast.error("Please login to use wishlist"); return; }
    if (!product) return;
    try {
      if (inWishlist) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        if (!error) {
          setInWishlist(false);
          toast.success("Removed from wishlist");
        }
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: product.id });
        if (!error) {
          setInWishlist(true);
          toast.success("Added to wishlist");
        }
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-2xl" />
        <div className="space-y-4"><div className="h-6 bg-gray-100 rounded w-1/3" /><div className="h-8 bg-gray-100 rounded w-2/3" /><div className="h-20 bg-gray-100 rounded" /></div>
      </div>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-slate-400">Product not found</div>;

  const effectivePrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="product-detail-page">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link><span>/</span>
        <Link to="/products" className="hover:text-[#16a34a]">Products</Link><span>/</span>
        <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImage ? "border-[#16a34a]" : "border-transparent"}`}
                  data-testid={`product-image-thumb-${i}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2 block">{product.category}</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Outfit' }} data-testid="product-name">
            {product.name}
          </h1>

          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-[#0f172a]" data-testid="product-price">${effectivePrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">${product.price.toFixed(2)}</span>
                <span className="bg-[#ff6a3d] text-white text-xs font-bold px-2.5 py-1 rounded-full">-{product.discount}% OFF</span>
              </>
            )}
            <span className="text-sm text-slate-400">/ {product.unit}</span>
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className={`text-sm font-medium ${product.stock < 20 ? "text-amber-500" : "text-[#16a34a]"}`} data-testid="stock-status">
                {product.stock < 20 ? `Only ${product.stock} left in stock` : "In Stock"}
              </span>
            ) : (
              <span className="text-sm font-medium text-red-500">Out of Stock</span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">{product.description}</p>

          {/* Quantity + Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-gray-100 rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors" data-testid="qty-decrease">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm font-medium min-w-[40px] text-center" data-testid="qty-display">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors" data-testid="qty-increase">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
              className="flex-1 bg-[#16a34a] text-white hover:bg-[#15803d] rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="add-to-cart-btn"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              className={`p-3 rounded-xl border-2 transition-colors ${inWishlist ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-slate-400 hover:border-red-200 hover:text-red-500"}`}
              data-testid="wishlist-toggle-btn"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500" : ""}`} />
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags?.map(tag => (
              <span key={tag} className="bg-gray-100 text-slate-600 text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Outfit' }}>Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center" data-testid="cart-empty">
        <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit' }}>Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Add some organic goodness to your cart!</p>
        <Link to="/products" className="bg-[#16a34a] text-white hover:bg-[#15803d] rounded-xl px-6 py-3 font-medium transition-colors inline-flex items-center gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="cart-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline" data-testid="clear-cart-btn">Clear Cart</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => {
            const product = item.product;
            const effectivePrice = product.price * (1 - (product.discount || 0) / 100);
            return (
              <motion.div
                key={item.product_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-4 flex gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                data-testid={`cart-item-${item.product_id}`}
              >
                <Link to={`/products/${product.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
                  <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-1 hover:text-[#16a34a]">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">${effectivePrice.toFixed(2)} / {product.unit}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-2 hover:bg-gray-200 rounded-l-lg" data-testid={`cart-qty-decrease-${item.product_id}`}>
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-2 hover:bg-gray-200 rounded-r-lg" data-testid={`cart-qty-increase-${item.product_id}`}>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-slate-900">${(effectivePrice * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.product_id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" data-testid={`cart-remove-${item.product_id}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24" data-testid="cart-summary">
            <h3 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: 'Outfit' }}>Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal ({items.length} items)</span>
                <span className="font-medium text-slate-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Delivery</span>
                <span className="font-medium text-[#16a34a]">{total >= 50 ? "Free" : "$4.99"}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-bold text-lg text-slate-900" data-testid="cart-total">${(total + (total >= 50 ? 0 : 4.99)).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => user ? navigate("/checkout") : navigate("/auth?redirect=checkout")}
              className="w-full bg-[#16a34a] text-white hover:bg-[#15803d] rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2"
              data-testid="proceed-to-checkout-btn"
            >
              {user ? "Proceed to Checkout" : "Login to Checkout"} <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/products" className="block text-center text-sm text-[#16a34a] font-medium mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

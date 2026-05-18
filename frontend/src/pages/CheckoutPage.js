import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { CreditCard, Tag, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponValid, setCouponValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const deliveryFee = total >= 50 ? 0 : 4.99;
  const finalTotal = total - couponDiscount + deliveryFee;

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .single();
      
      if (data && (!data.expires_at || new Date(data.expires_at) > new Date())) {
        const discount = total >= (data.min_cart_total || 0) ? data.discount : 0;
        setCouponDiscount(discount);
        setCouponValid(true);
        toast.success(`Coupon applied! You save $${discount.toFixed(2)}`);
      } else {
        throw new Error("Invalid or expired coupon");
      }
    } catch (e) {
      setCouponDiscount(0);
      setCouponValid(false);
      toast.error("Invalid coupon");
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) { toast.error("Please enter shipping address"); return; }
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price * (1 - (item.product.discount || 0) / 100),
        product_name: item.product.name,
        product_image: item.product.images?.[0]
      }));

      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        total: finalTotal,
        status: 'pending',
        shipping_address: address,
        shipping_city: city,
        shipping_zip: zip,
        shipping_phone: phone,
        coupon_code: couponValid ? couponCode : null
      }).select().single();

      if (error) throw error;

      // Create order items
      for (const item of orderItems) {
        await supabase.from('order_items').insert({
          order_id: (await supabase.from('orders').select('id').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single()).data.id,
          ...item
        });
      }

      // Clear cart
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      clearCart();

      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (e) {
      toast.error(e.message || "Checkout failed");
      setLoading(false);
    }
  };

  if (!user) { navigate("/auth?redirect=checkout"); return null; }
  if (items.length === 0) { navigate("/cart"); return null; }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="checkout-page">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8" style={{ fontFamily: 'Outfit' }}>Checkout</h1>
      <div className="grid md:grid-cols-5 gap-8">
        {/* Shipping Form */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-base font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Outfit' }}>Shipping Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-1">Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your full address"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm" data-testid="shipping-address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 block mb-1">City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm" data-testid="shipping-city" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">ZIP Code</label>
                  <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm" data-testid="shipping-zip" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm" data-testid="shipping-phone" />
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
              <Tag className="w-4 h-4 text-[#ff6a3d]" /> Discount Code
            </h3>
            <div className="flex gap-2">
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm uppercase" data-testid="coupon-input" />
              <button onClick={validateCoupon} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors" data-testid="apply-coupon-btn">
                Apply
              </button>
            </div>
            {couponValid && <p className="mt-2 text-sm text-[#16a34a] font-medium">Coupon applied! Saving ${couponDiscount.toFixed(2)}</p>}
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24" data-testid="checkout-summary">
            <h3 className="text-base font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Outfit' }}>Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const ep = item.product.price * (1 - (item.product.discount || 0) / 100);
                return (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-slate-600 line-clamp-1 flex-1">{item.product.name} x{item.quantity}</span>
                    <span className="font-medium ml-2">${(ep * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span>${total.toFixed(2)}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-[#16a34a]">Discount</span><span className="text-[#16a34a]">-${couponDiscount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-slate-500">Delivery</span><span className={deliveryFee === 0 ? "text-[#16a34a]" : ""}>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span></div>
              <div className="border-t border-gray-100 pt-2 flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-lg" data-testid="checkout-total">${finalTotal.toFixed(2)}</span></div>
            </div>
            <button onClick={handleCheckout} disabled={loading}
              className="w-full mt-6 bg-[#ff6a3d] text-white hover:bg-[#ea580c] rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="pay-now-btn">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {loading ? "Processing..." : `Place Order $${finalTotal.toFixed(2)}`}
            </button>
            <p className="text-xs text-slate-400 text-center mt-3">Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
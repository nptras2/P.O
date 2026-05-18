import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#dcfce7] to-[#f0fdf4]" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-4 bg-white/70 px-3 py-1.5 rounded-full">
              100% Organic
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-4" style={{ fontFamily: 'Outfit' }}>
              Fresh & Organic<br />
              <span className="text-[#16a34a]">Grocery</span> Delivered
            </h1>
            <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-md">
              Premium organic produce sourced directly from trusted farms. Chemical-free, nutrient-rich, and delivered fresh to your doorstep.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="bg-[#ff6a3d] text-white hover:bg-[#ea580c] rounded-xl px-6 py-3 font-medium transition-colors inline-flex items-center gap-2 text-sm"
                data-testid="hero-shop-now-btn"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products?featured=true"
                className="border-2 border-[#16a34a] text-[#16a34a] hover:bg-[#dcfce7] rounded-xl px-6 py-3 font-medium transition-colors text-sm"
                data-testid="hero-explore-btn"
              >
                Explore Deals
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-4 max-w-sm">
              <div className="w-10 h-10 bg-[#16a34a]/10 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#16a34a]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Free Delivery</p>
                <p className="text-xs text-slate-500">On all orders above $50</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <img
              src="https://images.unsplash.com/photo-1418669112725-fb499fb61127?w=600&h=600&fit=crop"
              alt="Fresh organic produce"
              className="rounded-3xl shadow-2xl w-full max-w-lg mx-auto object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff6a3d]/10 rounded-full flex items-center justify-center">
                <span className="text-[#ff6a3d] font-bold text-sm">4.9</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Customer Rating</p>
                <p className="text-xs text-slate-500">2,000+ happy customers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

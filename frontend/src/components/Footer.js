import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import logo from "@/assets/panjab-organic-logo.png";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.post("/newsletter/subscribe", { email });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch {
      toast.error("Failed to subscribe");
    }
  };

  return (
    <footer className="bg-[#0f172a] text-white pb-24 md:pb-0" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="Panjab Organic" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-bold text-2xl" style={{ fontFamily: 'Outfit' }}>Panjab Organic</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Your trusted source for premium organic groceries. Farm-fresh, chemical-free products delivered to your doorstep.
            </p>
            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4" /> support@panjaborganic.com
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4" /> Chandigarh, India
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4" style={{ fontFamily: 'Outfit' }}>Quick Links</h4>
            <div className="space-y-2">
              {[{ to: "/products", label: "Shop All" }, { to: "/about", label: "About Us" }, { to: "/products?category=fruits", label: "Fruits" }, { to: "/products?category=vegetables", label: "Vegetables" }, { to: "/products?category=dairy", label: "Dairy" }].map((l) => (
                <Link key={l.to} to={l.to} className="block text-sm text-slate-400 hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-semibold text-base mb-4" style={{ fontFamily: 'Outfit' }}>Customer</h4>
            <div className="space-y-2">
              {[{ to: "/profile", label: "My Account" }, { to: "/orders", label: "Orders" }, { to: "/wishlist", label: "Wishlist" }, { to: "/cart", label: "Cart" }].map((l) => (
                <Link key={l.to} to={l.to} className="block text-sm text-slate-400 hover:text-white transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-base mb-4" style={{ fontFamily: 'Outfit' }}>Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Get exclusive deals and updates delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#16a34a]"
                data-testid="newsletter-email-input"
              />
              <button type="submit" className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors" data-testid="newsletter-subscribe-btn">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Panjab Organic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

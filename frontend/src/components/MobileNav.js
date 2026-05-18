import { Link, useLocation } from "react-router-dom";
import { Store, Search, User, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function MobileNav() {
  const location = useLocation();
  const { count } = useCart();

  if (location.pathname.startsWith("/admin")) return null;

  const links = [
    { to: "/products", icon: Store, label: "Shop" },
    { to: "/products?search=", icon: Search, label: "Search" },
    { to: "/profile", icon: User, label: "Account" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
    { to: "/cart", icon: ShoppingCart, label: "Cart", badge: count },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe" data-testid="mobile-nav">
      <div className="flex items-center justify-around py-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.label}
              to={link.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors relative ${active ? "text-[#16a34a]" : "text-slate-500"}`}
              data-testid={`mobile-nav-${link.label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
              {link.badge > 0 && (
                <span className="absolute -top-0.5 right-1 bg-[#ff6a3d] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

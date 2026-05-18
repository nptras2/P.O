import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, LogOut, Package, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/panjab-organic-logo.png";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const searchRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(6);
      setSearchResults(data || []);
      setShowSearch(true);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/about", label: "About Us" },
    // Contact Us removed — contact details live in footer
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#16a34a] text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-medium">Free delivery on orders above $50</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowStore(!showStore)} className="flex items-center gap-1 hover:underline" data-testid="find-store-btn">
              <MapPin className="w-3 h-3" /> Find Store
            </button>
            <span>Call: +1 (800) 123-4567</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm" data-testid="main-header">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* ── Mobile hamburger (md and below) ── */}
          <button
            className="md:hidden p-2 flex-shrink-0"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            data-testid="mobile-menu-btn"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* ── Logo (larger — dominates across all breakpoints) ── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0" data-testid="logo-link">
            <img
              src={logo}
              alt="Panjab Organic"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <span className="font-bold text-2xl hidden sm:block" style={{ fontFamily: 'Outfit' }}>
              <span className="text-[#0f172a]">Panjab</span>
              <span className="text-[#16a34a]"> Organic</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden md:flex items-center gap-1 max-w-[260px] flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Search (flex-grow — shrinks on narrow / tablet) ── */}
          <div ref={searchRef} className="flex-1 hidden md:block relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search organic products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm transition-all bg-gray-50"
                  data-testid="search-input"
                />
              </div>
            </form>
            <AnimatePresence>
              {showSearch && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden z-50"
                >
                  {searchResults.slice(0, 6).map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.slug}`}
                      onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-[#16a34a] font-semibold">${p.price}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Desktop action icons ── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative" data-testid="wishlist-link">
              <Heart className="w-5 h-5 text-slate-600" />
            </Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative" data-testid="cart-link">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#ff6a3d] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <div ref={userRef} className="relative">
              <button onClick={() => setShowUser(!showUser)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1" data-testid="user-menu-btn">
                <User className="w-5 h-5 text-slate-600" />
                <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
              </button>
              <AnimatePresence>
                {showUser && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-slate-900">{user.full_name || "User"}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setShowUser(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-slate-700" data-testid="profile-link">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link to="/orders" onClick={() => setShowUser(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-slate-700" data-testid="orders-link">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        {user.role === "admin" && (
                          <Link to="/admin" onClick={() => setShowUser(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-[#16a34a] font-medium">
                            Admin Panel
                          </Link>
                        )}
                        <button onClick={() => { logout(); setShowUser(false); }} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-red-500 w-full" data-testid="logout-btn">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </>
                    ) : (
                      <Link to="/auth" onClick={() => setShowUser(false)} className="block px-4 py-3 hover:bg-gray-50 text-sm text-slate-700 font-medium" data-testid="login-link">
                        Login / Sign Up
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Mobile search bar (md=768px and below) ── */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search organic products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm bg-gray-50"
                data-testid="mobile-search-input"
              />
            </div>
          </form>
        </div>
      </header>

      {/* ── Mobile slide-in menu ── */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowMobileMenu(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 25 }} className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl overflow-y-auto">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
                    <img src={logo} alt="Panjab Organic" className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-bold text-lg" style={{ fontFamily: 'Outfit' }}>Panjab Organic</span>
                  </Link>
                  <button onClick={() => setShowMobileMenu(false)} className="p-2"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-slate-700"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2 border-gray-100" />
                {[
                  { to: "/products?category=fruits", label: "Fruits" },
                  { to: "/products?category=vegetables", label: "Vegetables" },
                  { to: "/products?category=dairy", label: "Dairy & Eggs" },
                  { to: "/products?category=grains", label: "Grains" },
                  { to: "/products?category=spices", label: "Spices" },
                  { to: "/products?category=beverages", label: "Beverages" },
                ].map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setShowMobileMenu(false)} className="block px-4 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-slate-700">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Store popup */}
      <AnimatePresence>
        {showStore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowStore(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Outfit' }}>Our Stores</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-medium text-sm">Panjab Organic - Main Store</p>
                  <p className="text-xs text-slate-500 mt-1">123 Green Valley Road, Chandigarh</p>
                  <p className="text-xs text-slate-500">Mon-Sat: 8AM – 9PM</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-medium text-sm">Panjab Organic - City Center</p>
                  <p className="text-xs text-slate-500 mt-1">456 Market Street, Amritsar</p>
                  <p className="text-xs text-slate-500">Mon-Sat: 9AM – 8PM</p>
                </div>
              </div>
              <button onClick={() => setShowStore(false)} className="mt-4 w-full bg-[#16a34a] text-white rounded-xl py-2 text-sm font-medium hover:bg-[#15803d] transition-colors">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

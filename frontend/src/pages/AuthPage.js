import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatError } from "@/lib/api";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/panjab-organic-logo.png";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let loggedUser;
      if (isLogin) {
        loggedUser = await login(email, password);
        toast.success("Welcome back!");
      } else {
        loggedUser = await register(email, password, name);
      }

      if (!loggedUser) {
        // Email confirmation required — no session yet
        toast.info("Account created! Check your email to confirm.");
        navigate("/auth?registered=1");
        return;
      }

      toast.success(isLogin ? "Welcome back!" : "Account created!");
      const redirectTo = redirect.startsWith("/") ? redirect : `/${redirect}`;
      if (loggedUser?.role === "admin" && redirectTo === "/") {
        navigate("/admin");
      } else {
        navigate(redirectTo);
      }
    } catch (err) {
      setError(formatError(err.response?.data?.detail) || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4" data-testid="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src={logo} alt="Panjab Organic" className="w-10 h-10 rounded-full object-cover" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLogin ? "Sign in to continue shopping" : "Join Panjab Organic today"}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              data-testid="login-tab"
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              data-testid="register-tab"
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4" data-testid="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm"
                  data-testid="name-input"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-600 block mb-1">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm"
                data-testid="email-input"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm pr-10"
                  data-testid="password-input"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#16a34a] text-white hover:bg-[#15803d] rounded-xl py-3 font-medium transition-colors disabled:opacity-50"
              data-testid="auth-submit-btn"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

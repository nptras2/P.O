import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("checking");
  const { fetchCart } = useCart();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }

    const pollStatus = async () => {
      try {
        const { data } = await api.get(`/payments/status/${sessionId}`);
        if (data.payment_status === "paid") {
          setStatus("success");
          fetchCart();
          return;
        }
        if (data.status === "expired") {
          setStatus("error");
          return;
        }
        if (attempts < 10) {
          setTimeout(() => setAttempts(a => a + 1), 2000);
        } else {
          setStatus("error");
        }
      } catch {
        if (attempts < 10) {
          setTimeout(() => setAttempts(a => a + 1), 2000);
        } else {
          setStatus("error");
        }
      }
    };
    pollStatus();
  }, [sessionId, attempts, fetchCart]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4" data-testid="payment-success-page">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        {status === "checking" && (
          <>
            <Loader2 className="w-16 h-16 text-[#16a34a] mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit' }}>Processing Payment...</h2>
            <p className="text-slate-500">Please wait while we confirm your payment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-[#16a34a] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit' }}>Payment Successful!</h2>
            <p className="text-slate-500 mb-6">Your order has been confirmed. You will receive an email shortly.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/orders" className="bg-[#16a34a] text-white rounded-xl px-6 py-3 font-medium hover:bg-[#15803d] transition-colors" data-testid="view-orders-link">
                View Orders
              </Link>
              <Link to="/products" className="border-2 border-[#16a34a] text-[#16a34a] rounded-xl px-6 py-3 font-medium hover:bg-[#dcfce7] transition-colors">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit' }}>Payment Issue</h2>
            <p className="text-slate-500 mb-6">We couldn't confirm your payment. Please check your orders or try again.</p>
            <Link to="/orders" className="bg-[#16a34a] text-white rounded-xl px-6 py-3 font-medium hover:bg-[#15803d] transition-colors">
              Check Orders
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}

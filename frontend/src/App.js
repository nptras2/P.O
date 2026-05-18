import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import AboutPage from "@/pages/AboutPage";
import OrdersPage from "@/pages/OrdersPage";
import WishlistPage from "@/pages/WishlistPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminCoupons from "@/pages/admin/AdminCoupons";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" richColors />
          <div className="min-h-screen flex flex-col" data-testid="app-root">
            <Routes>
              {/* Admin routes - no header/footer */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="coupons" element={<AdminCoupons />} />
              </Route>
              {/* Public routes */}
              <Route path="*" element={<PublicLayout />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function PublicLayout() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}

export default App;

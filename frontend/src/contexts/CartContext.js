import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setProducts({});
      return;
    }
    const { data } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id);
    
    const cartItems = data || [];
    setItems(cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      product: item.products
    })));
    
    const productsMap = {};
    cartItems.forEach(item => {
      if (item.products) {
        productsMap[item.product_id] = item.products;
      }
    });
    setProducts(productsMap);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) return;
    
    const existingItem = items.find(item => item.product_id === product.id);
    
    if (existingItem) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('user_id', user.id)
        .eq('product_id', product.id);
      if (!error) {
        setItems(items.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      }
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity
        });
      if (!error) {
        setItems([...items, {
          product_id: product.id,
          quantity,
          product
        }]);
        setProducts({ ...products, [product.id]: product });
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);
    
    if (!error) {
      setItems(items.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    
    if (!error) {
      setItems(items.filter(item => item.product_id !== productId));
      const newProducts = { ...products };
      delete newProducts[productId];
      setProducts(newProducts);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    
    if (!error) {
      setItems([]);
      setProducts({});
    }
  };

  const total = items.reduce((sum, item) => {
    const product = item.product;
    if (!product) return sum;
    const effectivePrice = product.price * (1 - (product.discount || 0) / 100);
    return sum + effectivePrice * item.quantity;
  }, 0);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      products,
      total,
      count,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
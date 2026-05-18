-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  cart_adds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles ON DELETE CASCADE,
  product_id UUID REFERENCES products ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_zip TEXT,
  shipping_phone TEXT,
  payment_intent_id TEXT,
  coupon_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders ON DELETE CASCADE,
  product_id UUID REFERENCES products ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  product_name TEXT,
  product_image TEXT
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products ON DELETE CASCADE,
  user_id UUID REFERENCES profiles ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles ON DELETE CASCADE,
  product_id UUID REFERENCES products ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount DECIMAL(10,2) NOT NULL,
  min_cart_total DECIMAL(10,2) DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON cart_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own wishlist" ON wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlist" ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist" ON wishlist FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Products are public (no RLS needed for public read access)
-- Admin policies would be added for modifying products

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
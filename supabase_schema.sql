-- Industry Standard E-commerce Schema for "Arsyil" (Security Enhanced & Idempotent)

-- 1. Profiles Table (Linked to Auth Users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE, -- Security Flag
  billing_address JSONB,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Categories Table (Supports Hierarchy: Kategori -> Jenis)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  base_price DECIMAL(12,2) NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Product Variants
CREATE TABLE IF NOT EXISTS variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  name TEXT, -- e.g. "Space Gray / 256GB"
  option1_name TEXT, -- e.g. "Color"
  option1_value TEXT, -- e.g. "Space Gray"
  option2_name TEXT, -- e.g. "Size"
  option2_value TEXT, -- e.g. "L"
  price_adjustment DECIMAL(12,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES variants(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0
);

-- 6. Site Content Table (CMS)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- e.g. "hero", "about", "footer"
  key TEXT NOT NULL UNIQUE, -- e.g. "hero_title", "hero_image"
  content TEXT, -- Plain text or stringified JSON
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Lookbooks Table
CREATE TABLE IF NOT EXISTS lookbooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Lookbook-Product Junction
CREATE TABLE IF NOT EXISTS lookbook_products (
  lookbook_id UUID REFERENCES lookbooks(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (lookbook_id, product_id)
);

-- 9. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, processing, shipped, delivered, cancelled
  total_amount DECIMAL(12,2) NOT NULL,
  shipping_fee DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  shipping_address JSONB,
  billing_address JSONB,
  payment_id TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL, -- Price at time of purchase
  total_price DECIMAL(12,2) NOT NULL
);

-- SECURITY: Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 11. Helper Functions
-- Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Policies Cleanup & Re-creation
DO $$ 
BEGIN
    -- Drop existing policies to avoid conflicts
    DROP POLICY IF EXISTS "Profiles are self-viewable" ON profiles;
    DROP POLICY IF EXISTS "Profiles are self-updatable" ON profiles;
    DROP POLICY IF EXISTS "Profiles self-select" ON profiles;
    DROP POLICY IF EXISTS "Profiles self-update" ON profiles;
    DROP POLICY IF EXISTS "Admin view all profiles" ON profiles;

    DROP POLICY IF EXISTS "Categories public read, admin all" ON categories;
    DROP POLICY IF EXISTS "Categories public read" ON categories;
    DROP POLICY IF EXISTS "Categories admin all" ON categories;

    DROP POLICY IF EXISTS "Products public read, admin all" ON products;
    DROP POLICY IF EXISTS "Products public read" ON products;
    DROP POLICY IF EXISTS "Products admin all" ON products;

    DROP POLICY IF EXISTS "Variants/Images public read, admin all" ON variants;
    DROP POLICY IF EXISTS "Variants/Images public read" ON variants;
    DROP POLICY IF EXISTS "Variants admin all" ON variants;

    DROP POLICY IF EXISTS "ProductImages public read, admin all" ON product_images;
    DROP POLICY IF EXISTS "ProductImages public read" ON product_images;
    DROP POLICY IF EXISTS "ProductImages admin all" ON product_images;

    DROP POLICY IF EXISTS "SiteContent public read, admin all" ON site_content;
    DROP POLICY IF EXISTS "SiteContent public read" ON site_content;
    DROP POLICY IF EXISTS "SiteContent admin all" ON site_content;

    DROP POLICY IF EXISTS "Lookbooks public read, admin all" ON lookbooks;
    DROP POLICY IF EXISTS "Lookbooks public read" ON lookbooks;
    DROP POLICY IF EXISTS "Lookbooks admin all" ON lookbooks;

    DROP POLICY IF EXISTS "LookbookProducts public read, admin all" ON lookbook_products;
    DROP POLICY IF EXISTS "LookbookProducts public read" ON lookbook_products;
    DROP POLICY IF EXISTS "LookbookProducts admin all" ON lookbook_products;

    DROP POLICY IF EXISTS "Users can place orders" ON orders;
    DROP POLICY IF EXISTS "Users view own orders" ON orders;
    DROP POLICY IF EXISTS "Admin update orders" ON orders;
    DROP POLICY IF EXISTS "Users can view own orders" ON orders;
    DROP POLICY IF EXISTS "Admin can update orders" ON orders;

    DROP POLICY IF EXISTS "Users view own items" ON order_items;
    DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
END $$;

-- Profiles: Own read/write, Admin read all
CREATE POLICY "Profiles self-select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles self-update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin view all profiles" ON profiles FOR SELECT USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);

-- Storefront Content (Public Read, Admin ALL)
CREATE POLICY "Categories public read" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Categories admin all" ON categories FOR ALL 
  TO authenticated 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);

CREATE POLICY "Products public read" ON products FOR SELECT USING (is_published = TRUE OR (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);
CREATE POLICY "Products admin all" ON products FOR ALL 
  TO authenticated 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);

CREATE POLICY "Variants public read" ON variants FOR SELECT USING (TRUE);
CREATE POLICY "Variants admin all" ON variants FOR ALL 
  TO authenticated 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);

CREATE POLICY "ProductImages public read" ON product_images FOR SELECT USING (TRUE);
CREATE POLICY "ProductImages admin all" ON product_images FOR ALL 
  TO authenticated 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);

CREATE POLICY "SiteContent public read" ON site_content FOR SELECT USING (TRUE);
CREATE POLICY "SiteContent admin all" ON site_content FOR ALL 
  TO authenticated 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);

CREATE POLICY "Lookbooks public read" ON lookbooks FOR SELECT USING (TRUE);
CREATE POLICY "Lookbooks admin all" ON lookbooks FOR ALL 
  TO authenticated 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);

CREATE POLICY "LookbookProducts public read" ON lookbook_products FOR SELECT USING (TRUE);
CREATE POLICY "LookbookProducts admin all" ON lookbook_products FOR ALL 
  TO authenticated 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);

-- Orders
CREATE POLICY "Users can place orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);
CREATE POLICY "Admin update orders" ON orders FOR UPDATE USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE);

CREATE POLICY "Users view own items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE)
  )
);

-- 13. Auth Trigger (Auto-Profile Creation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger to avoid existence errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 14. Initial Seed Data (CMS)
INSERT INTO site_content (section, key, content, image_url) VALUES
('hero', 'hero_title', 'The New Era of Modest Modernity', NULL),
('hero', 'hero_subtitle', 'Experience the perfect blend of tradition and contemporary elegance with our latest ARSYIL collections.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop'),
('about', 'brand_vision', 'Designing timeless pieces for the modern woman who values quality and heritage.', NULL)
ON CONFLICT (key) DO NOTHING;

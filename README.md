# Panjab Organic

A full-stack eCommerce project for Panjab Organic, migrated to Supabase.

## Project Structure

* `frontend`: React + Tailwind CSS project with Supabase integration

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key

### 2. Configure Supabase

Run the SQL schema in your Supabase SQL editor:

```sql
-- See supabase_schema.sql for complete database schema
```

### 3. Create Admin User

After starting the app, sign up with email `admin@panjaborganic.com` and set the role to `admin` in the Supabase dashboard under profiles table.

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

## Features

* Admin panel
* Cart
* Authentication (Supabase Auth)
* Products catalog
* Wishlist
* Orders
* Coupons

## Environment Variables

### Frontend (.env)
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anon key

## Database Schema

See `supabase_schema.sql` for the complete PostgreSQL schema with:
- profiles (user profiles with role support)
- products
- categories
- cart_items
- orders
- order_items
- reviews
- wishlist
- coupons

## Admin Dashboard

To create an admin user:
1. Sign up via the application
2. In Supabase Dashboard > Authentication > Users, find your user
3. In Table Editor > profiles, edit the user's role to `admin`
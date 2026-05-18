import { supabase } from './supabase';

const seedProducts = [
  {
    name: "Organic Alphonso Mangoes",
    slug: "organic-alphonso-mangoes",
    description: "Premium Alphonso mangoes, handpicked from organic farms. Sweet, juicy and full of flavor.",
    price: 24.99,
    discount: 10,
    category: "fruits",
    images: ["https://images.unsplash.com/photo-1553279374-b7881eb9de07?w=600&h=600&fit=crop"],
    stock: 50,
    unit: "kg",
    featured: true,
    tags: ["seasonal", "premium"]
  },
  {
    name: "Fresh Organic Spinach",
    slug: "fresh-organic-spinach",
    description: "Fresh spinach leaves, grown without chemicals. Perfect for salads and cooking.",
    price: 3.99,
    discount: 0,
    category: "vegetables",
    images: ["https://images.unsplash.com/photo-1576045059946-b49e3b9e3b9e?w=600&h=600&fit=crop"],
    stock: 100,
    unit: "bunch",
    featured: true,
    tags: ["leafy", "fresh"]
  },
  {
    name: "Organic Farm Eggs",
    slug: "organic-farm-eggs",
    description: "Free-range organic eggs from happy hens. Rich in protein and vitamins.",
    price: 6.99,
    discount: 5,
    category: "dairy",
    images: ["https://images.unsplash.com/photo-1582722872445-76a9f9c7c7c7?w=600&h=600&fit=crop"],
    stock: 75,
    unit: "dozen",
    featured: false,
    tags: ["protein", "breakfast"]
  },
  {
    name: "Organic Basmati Rice",
    slug: "organic-basmati-rice",
    description: "Aromatic basmati rice, aged to perfection. Naturally gluten-free.",
    price: 12.99,
    discount: 0,
    category: "grains",
    images: ["https://images.unsplash.com/photo-1586438411688-2a8a0a0a0a0a?w=600&h=600&fit=crop"],
    stock: 200,
    unit: "kg",
    featured: true,
    tags: ["staple", "aromatic"]
  },
  {
    name: "Turmeric Powder",
    slug: "turmeric-powder",
    description: "Pure organic turmeric powder with high curcumin content. Anti-inflammatory properties.",
    price: 8.99,
    discount: 0,
    category: "spices",
    images: ["https://images.unsplash.com/photo-1595160442558-5a5e0a0a0a0a?w=600&h=600&fit=crop"],
    stock: 150,
    unit: "100g",
    featured: false,
    tags: ["anti-inflammatory", "spice"]
  }
];

export async function seedDatabase() {
  console.log('Seeding database...');
  const { error } = await supabase.from('products').insert(seedProducts);
  if (error) {
    console.error('Error seeding database:', error);
  } else {
    console.log('Database seeded successfully!');
  }
}
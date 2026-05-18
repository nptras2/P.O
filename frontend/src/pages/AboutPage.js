import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Truck, ShieldCheck, Clock, Heart, MapPin, Phone, Mail, Star } from "lucide-react";
import logo from "@/assets/panjab-organic-logo.png";

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    { icon: Leaf, title: "100% Natural", desc: "Every product is sourced from certified organic farms. No synthetic pesticides, no artificial preservatives — just pure nature." },
    { icon: Truck, title: "Farm Fresh", desc: "We work directly with farmers to bring you produce harvested at peak ripeness and delivered within 24 hours of picking." },
    { icon: ShieldCheck, title: "Quality Tested", desc: "Every batch passes through our in-house quality lab. We test for purity, nutrient content, and safety before it reaches you." },
    { icon: Heart, title: "Customer Trust", desc: "Over 2,000 happy families rely on us. Our 4.9-star rating speaks for itself — because your health deserves nothing less." },
  ];

  const timeline = [
    { year: "2018", title: "The Beginning", desc: "Founded by a family of third-generation Punjab farmers with a simple belief — every family deserves access to genuinely organic food." },
    { year: "2020", title: "Going Online", desc: "Launched our e-commerce platform, connecting organic farms across Punjab directly with urban families across India." },
    { year: "2023", title: "National Reach", desc: "Expanded delivery to 15+ states and partnered with 50+ certified organic farms, while keeping quality our only promise." },
    { year: "2024", title: "Today", desc: "Serving 2,000+ happy customers with a curated range of 100+ organic products — grains, vegetables, dairy, spices, and more." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-white" data-testid="about-hero">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,80 Q25,60 50,80 T100,80 V100 H0 Z" fill="#bbf7d0" />
            <path d="M0,90 Q25,75 50,90 T100,90 V100 H0 Z" fill="#86efac" />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <img
            src={logo}
            alt="Panjab Organic"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-lg"
          />
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4"
            style={{ fontFamily: 'Outfit' }}
          >
            About <span className="text-[#16a34a]">Panjab Organic</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Rooted in the fertile lands of Punjab, we bring you certified organic, farm-fresh products with a promise — pure, honest, and delivered straight to your doorstep.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-16 md:py-24" data-testid="about-story">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2 bg-[#dcfce7] px-3 py-1.5 rounded-full">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Born From the Soil of Punjab</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1500651230703-75d6bed0e2b9?w=900&h=675&fit=crop"
                alt="Organic farm fields"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Panjab Organic started with a simple mission — bring pure, farm-fresh and natural products directly to families while supporting healthy lifestyles and trusted farming practices.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                What began as a small family initiative in Chandigarh has grown into a trusted online destination for organic groceries. We built every part of it ourselves — sourcing directly from farmers, testing each batch in our lab, and delivering with care.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#16a34a]" style={{ fontFamily: 'Outfit' }}>2018</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Founded</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#16a34a]" style={{ fontFamily: 'Outfit' }}>50+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Partner Farms</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#16a34a]" style={{ fontFamily: 'Outfit' }}>4.9★</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-16 md:py-24 bg-[#f9fafb]" data-testid="about-timeline">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2 bg-[#dcfce7] px-3 py-1.5 rounded-full">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Growing With You</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#16a34a]/20 hidden sm:block" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10 hidden sm:flex" style={{ fontFamily: 'Outfit' }}>
                    {item.year.slice(-2)}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-[#16a34a] uppercase tracking-wide mb-1">{item.year}</p>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Outfit' }}>{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values / Why Panjab Organic ── */}
      <section className="py-16 md:py-24" data-testid="about-values">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2 bg-[#dcfce7] px-3 py-1.5 rounded-full">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>What Makes Us Different</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl bg-[#f9fafb] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-[#dcfce7]">
                  <v.icon className="w-8 h-8 text-[#16a34a]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Outfit' }}>{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission statement ── */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#14532d] to-[#16a34a]" data-testid="about-mission">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Outfit' }}>
            Our Mission
          </h2>
          <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
            To make certified organic food accessible, affordable, and reliable for every Indian household, while empowering farmers who practice sustainable, chemical-free agriculture — one delivery at a time.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-[#16a34a] hover:bg-gray-100 font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            <Leaf className="w-4 h-4" /> Explore Our Products
          </Link>
        </div>
      </section>

      {/* ── Trust indicators ── */}
      <section className="py-16 md:py-20 bg-white" data-testid="about-trust">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2 bg-[#dcfce7] px-3 py-1.5 rounded-full">Trust &amp; Certifications</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Trusted by 2,000+ Families</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { stat: "50+", label: "Certified Organic Farms" },
              { stat: "100+", label: "Products in Catalogue" },
              { stat: "15+", label: "States Delivered To" },
            ].map((item) => (
              <div key={item.label} className="text-center p-8 rounded-2xl border border-gray-100 bg-[#f9fafb]">
                <p className="text-4xl font-bold text-[#16a34a] mb-2" style={{ fontFamily: 'Outfit' }}>{item.stat}</p>
                <p className="text-sm text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
          {/* Testimonial */}
          <div className="mt-10 bg-[#f9fafb] rounded-2xl p-8 md:p-10 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-slate-700 text-base leading-relaxed max-w-2xl mx-auto mb-4">
              "Best organic delivery service I've tried in India. The quality is consistently top-tier, the vegetables arrive fresh, and the prices are fair. Panjab Organic is now our family's go-to for all groceries."
            </p>
            <p className="text-sm font-medium text-slate-900">— Priya Sharma, Chandigarh</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#dcfce7] to-[#f0fdf4]" data-testid="about-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Outfit' }}>
            Ready to Live Organic?
          </h2>
          <p className="text-slate-600 mb-8">Join thousands of families making the switch to cleaner, healthier eating with Panjab Organic.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            Start Shopping <Leaf className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

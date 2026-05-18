import { motion } from "framer-motion";
import { Truck, ShieldCheck, Leaf, Clock } from "lucide-react";

const features = [
  { icon: Leaf, title: "100% Organic", desc: "Certified organic products sourced directly from trusted farms.", color: "#16a34a" },
  { icon: Truck, title: "Free Delivery", desc: "Free delivery on all orders above $50. Same day available.", color: "#ff6a3d" },
  { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Every product quality-checked before dispatch. 100% satisfaction.", color: "#16a34a" },
  { icon: Clock, title: "Fresh Daily", desc: "New stock arrives daily. Always get the freshest produce.", color: "#ff6a3d" },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 bg-white" data-testid="features-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2 block">Why Choose Us</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>The Panjab Organic Difference</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-[#F9FAFB] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${f.color}15` }}>
                <f.icon className="w-7 h-7" style={{ color: f.color }} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Outfit' }}>{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

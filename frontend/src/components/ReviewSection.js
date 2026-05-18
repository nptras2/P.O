import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Priya S.", rating: 5, text: "The freshest organic vegetables I've ever had! Delivered right on time. Love the quality.", avatar: "PS" },
  { name: "Arjun M.", rating: 5, text: "Amazing selection of spices. The turmeric is pure gold! Will definitely order again.", avatar: "AM" },
  { name: "Simran K.", rating: 4, text: "Great quality dairy products. The paneer is super fresh and tastes homemade.", avatar: "SK" },
  { name: "Rajesh P.", rating: 5, text: "Best organic grocery store online. The basmati rice is restaurant quality. Highly recommend!", avatar: "RP" },
];

export default function ReviewSection() {
  return (
    <section className="py-12 md:py-20 bg-white" data-testid="review-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2 block">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#F9FAFB] rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {r.avatar}
                </div>
                <span className="text-sm font-medium text-slate-900">{r.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

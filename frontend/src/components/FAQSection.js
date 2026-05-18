import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "Are all your products certified organic?", a: "Yes, all our products are certified organic and sourced from trusted farms. We verify every supplier to ensure the highest quality standards." },
  { q: "What is your delivery policy?", a: "We offer free delivery on orders above $50. Standard delivery takes 1-3 business days. Same-day delivery is available in select areas." },
  { q: "Can I return or exchange products?", a: "Yes, we have a hassle-free return policy. If you're not satisfied with any product, contact us within 24 hours of delivery for a full refund or exchange." },
  { q: "How do you ensure product freshness?", a: "We receive fresh stock daily from our partner farms. All perishable items are stored in climate-controlled facilities and delivered in insulated packaging." },
  { q: "Do you offer bulk ordering?", a: "Absolutely! We offer special pricing for bulk orders. Contact our team for custom quotes on large quantities." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards through our secure Stripe payment gateway. Your payment information is always encrypted and safe." },
];

export default function FAQSection() {
  return (
    <section className="py-12 md:py-20" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#16a34a] mb-2 block">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Frequently Asked Questions</h2>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-gray-100 rounded-2xl px-6 overflow-hidden bg-white">
                <AccordionTrigger className="text-sm font-medium text-slate-900 py-4 hover:no-underline" data-testid={`faq-trigger-${i}`}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

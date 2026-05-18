import Marquee from "react-fast-marquee";
import { Leaf, Truck, ShieldCheck, Heart } from "lucide-react";

const items = [
  { icon: Leaf, text: "100% Certified Organic" },
  { icon: Truck, text: "Free Delivery Over $50" },
  { icon: ShieldCheck, text: "Quality Guaranteed" },
  { icon: Heart, text: "Farm Fresh Daily" },
  { icon: Leaf, text: "No Chemicals or Pesticides" },
  { icon: Truck, text: "Same Day Delivery Available" },
];

export default function MarqueeBanner() {
  return (
    <div className="bg-[#16a34a] py-3 overflow-hidden" data-testid="marquee-banner">
      <Marquee gradient={false} speed={40}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mx-8 text-white">
            <item.icon className="w-4 h-4" />
            <span className="text-sm font-medium whitespace-nowrap">{item.text}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

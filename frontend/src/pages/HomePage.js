import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import DealSection from "@/components/DealSection";
import FeaturesSection from "@/components/FeaturesSection";
import ReviewSection from "@/components/ReviewSection";
import FAQSection from "@/components/FAQSection";
import MarqueeBanner from "@/components/MarqueeBanner";

export default function HomePage() {
  return (
    <div data-testid="home-page">
      <HeroSection />
      <MarqueeBanner />
      <CategorySection />
      <FeaturesSection />
      <DealSection />
      <ReviewSection />
      <FAQSection />
    </div>
  );
}

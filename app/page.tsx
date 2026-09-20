import { HeroEmptyState } from "@/features/hero/components/hero-empty-state";
import { HeroSection } from "@/features/hero/components/hero-section";
import { getHero } from "@/features/hero/services/hero-service";

export default async function Home() {
  const hero = await getHero();

  return hero ? <HeroSection hero={hero} /> : <HeroEmptyState />;
}

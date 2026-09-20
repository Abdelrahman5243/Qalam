import Image from "next/image";

import type { Hero } from "../types";

type HeroSectionProps = {
  hero: Hero;
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#173d38]">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-10 px-6 py-6 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-16 lg:px-16 lg:py-10">
        <div className="flex flex-col justify-between gap-16 py-4 lg:py-10">
          <div className="max-w-2xl">
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[clamp(4.5rem,7vw,7rem)]">{hero.title}</h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-[#49615b] sm:text-xl">{hero.description}</p>
            {hero.ctaText ? (
              <div className="mt-10 inline-flex items-center gap-3 border-b border-[#173d38] pb-2 text-sm font-semibold">
                <span>{hero.ctaText}</span>
                <span aria-hidden="true">↗</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-[55vh] overflow-hidden rounded-[1.5rem] bg-[#d9dfd8] lg:min-h-0">
          <Image src={hero.image.url} alt={hero.image.alt} fill priority unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
        </div>
      </section>
    </main>
  );
}

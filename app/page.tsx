import Image from "next/image";

import { getHero } from "@/features/hero/services/hero-service";
import { urlFor } from "@/lib/sanity/image";

export default async function Home() {
  const hero = await getHero();

  if (!hero) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f4f1eb] px-6 text-[#173d38]"><p className="max-w-md text-center text-lg leading-8">Add a hero in Sanity Studio, then refresh this page to see it here.</p></main>;
  }

  const imageUrl = urlFor(hero.image).width(1600).height(1800).fit("crop").auto("format").url();

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#173d38]">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-10 px-6 py-6 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-16 lg:px-16 lg:py-10">
        <div className="flex flex-col justify-between gap-16 py-4 lg:py-10">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[#5f716b]"><span>Portfolio</span><span>Sanity × Next.js</span></div>
          <div className="max-w-2xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#d56a3d]">Selected work</p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[clamp(4.5rem,7vw,7rem)]">{hero.title}</h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-[#49615b] sm:text-xl">{hero.description}</p>
            {hero.ctaText ? <div className="mt-10 inline-flex items-center gap-3 border-b border-[#173d38] pb-2 text-sm font-semibold"><span>{hero.ctaText}</span><span aria-hidden="true">↗</span></div> : null}
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#5f716b]">Edit this hero in /studio</p>
        </div>
        <div className="relative min-h-[55vh] overflow-hidden rounded-[1.5rem] bg-[#d9dfd8] lg:min-h-0"><Image src={imageUrl} alt={hero.image.alt || hero.title} fill priority unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" /></div>
      </section>
    </main>
  );
}

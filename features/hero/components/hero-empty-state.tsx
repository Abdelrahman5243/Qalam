import { Logo } from "@/features/site/components/logo";

export function HeroEmptyState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f0] px-6 text-[#24352c]">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <Logo variant="color" layout="stacked" decorative priority />
        <p className="text-lg leading-8">
          Add a hero image and content in Sanity Studio, then refresh this page to see the website hero.
        </p>
      </div>
    </main>
  );
}

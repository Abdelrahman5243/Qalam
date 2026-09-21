import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, description }: { eyebrow: ReactNode; title: ReactNode; description: ReactNode }) {
  return (
    <section className="inner-page-intro">
      <div className="inner-page-pattern" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => <span key={index} />)}
      </div>
      <div className="inner-page-container">
        <p className="inner-page-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

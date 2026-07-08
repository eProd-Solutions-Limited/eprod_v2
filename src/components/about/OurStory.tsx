'use client'

import { Sprout } from "lucide-react";
import Image from "next/image";
import foundersImg from "@/assets/Meet-the-founders.png";
import { CircleBackground } from '@/components/ui/CircleBackground'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const VIDEOS = [
  { id: "PN6xMDbZzBw", title: "eProd Founders – Minding Your Business with Jodi-Tatiana" },
  { id: "RWya30Ev_hg", title: "eProd Founders – Returning to Roots" },
];

const OurStory = () => {
  const { t } = useI18n()
  return (
    <section className="bg-background py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.about.story.headingLead}{" "}
              <span className="gradient-primary-text">{t.about.story.headingHighlight}</span>
            </h2>
          </div>

          <div className="flex justify-center mb-10">
            <div className="flex flex-col items-center gap-4">
              <a
                href={`https://www.youtube.com/watch?v=${VIDEOS[0].id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                aria-label="Watch founders on YouTube"
              >
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={foundersImg}
                    alt="eProd Founders"
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                  <svg
                    className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </a>
              <div className="flex gap-3">
                {VIDEOS.map(({ id }, i) => (
                  <a
                    key={id}
                    href={`https://www.youtube.com/watch?v=${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors max-w-40 text-center leading-tight"
                  >
                    {t.about.story.watchVideo} {i + 1}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
            <p>{t.about.story.p1}</p>
            <p>
              {t.about.story.p2a}
              <strong className="text-foreground">{t.about.story.p2strong}</strong>
              {t.about.story.p2b}
            </p>
            <p>{t.about.story.p3}</p>
          </div>

          <div className="mt-10 bg-primary/5 border border-primary/10 rounded-xl p-6 text-center">
            <p className="text-lg font-bold text-foreground">
              {t.about.story.quote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;

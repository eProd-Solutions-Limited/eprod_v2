import Image from "next/image";
import foundersImg from "@/assets/Meet-the-founders.png";
import { CircleBackground } from '@/components/ui/CircleBackground'

const VIDEOS = [
  { id: "PN6xMDbZzBw", title: "eProd Founders – Minding Your Business with Jodi-Tatiana" },
  { id: "RWya30Ev_hg", title: "eProd Founders – Returning to Roots" },
];

const MeetTheFounders = () => {
  return (
    <section className="bg-background py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Meet the{" "}
            <span className="gradient-primary-text">Founders</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Hear directly from the people who built eProd from the ground up.
          </p>
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
              {VIDEOS.map(({ id, title }, i) => (
                <a
                  key={id}
                  href={`https://www.youtube.com/watch?v=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors max-w-40 text-center leading-tight"
                >
                  Watch video {i + 1}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {VIDEOS.map(({ id, title }) => (
            <div key={id} className="rounded-xl overflow-hidden shadow-lg aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTheFounders;

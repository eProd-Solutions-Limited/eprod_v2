const VIDEOS = [
  { id: "PN6xMDbZzBw", title: "eProd Founders – Minding Your Business with Jodi-Tatiana" },
  { id: "RWya30Ev_hg", title: "eProd Founders – Returning to Roots" },
];

const MeetTheFounders = () => {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Meet the{" "}
            <span className="gradient-primary-text">Founders</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Hear directly from the people who built eProd from the ground up.
          </p>
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

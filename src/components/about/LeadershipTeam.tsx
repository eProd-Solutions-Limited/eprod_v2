import { Linkedin } from "lucide-react";
import jwvcPhoto from "@/assets/team-jwvc.jpg";
import avcPhoto from "@/assets/team-avc.jpg";
import srPhoto from "@/assets/team-sr.jpg";
import Image from "next/image";

const team = [
  {
    name: "Jan-Willem van Casteren",
    title: "CEO & Co-Founder",
    photo: jwvcPhoto,
    bio: "Visionary leader with deep roots in African agribusiness. A recognized thought leader on the intersection of Ag-Finance and EUDR compliance, Jan-Willem has architected eProd's platform to bridge supply chain traceability with financial inclusion, enabling banks to de-risk agricultural lending across the continent.",
    linkedin: "#",
  },
  {
    name: "Almut van Casteren",
    title: "COO & Co-Founder",
    photo: avcPhoto,
    bio: "Commercial strategist and impact-driven entrepreneur with 20+ years building inclusive agribusinesses in Africa. A Stanford SEED graduate, Almut drives eProd's expansion into climate-smart agriculture and financial inclusion, leveraging deep expertise in quality standards and public-private partnerships.",
    linkedin: "#",
  },
  {
    name: "Sarah Reusche",
    title: "Client Operations Manager",
    photo: srPhoto,
    bio: "Operations excellence champion with 15+ years of quality and project management expertise. Sarah leads eProd's client success strategy, ensuring every customer achieves maximum value. Her background in ISO quality standards underpins eProd's 95%+ customer retention rate.",
    linkedin: "#",
  },
];

const LeadershipTeam = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our{" "}
            <span className="gradient-primary-text">Leadership</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            A team built for a generational business. Our founders and senior management bring decades of combined experience in agriculture, technology, and finance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((person) => (
            <div
              key={person.name}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={person.photo}
                  alt={`${person.name}, ${person.title} at eProd Solutions`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={512}
                  height={512}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{person.name}</h3>
                    <p className="text-sm font-medium text-secondary">{person.title}</p>
                  </div>
                  <a
                    href={person.linkedin}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
                    aria-label={`${person.name}'s LinkedIn`}
                  >
                    <Linkedin size={16} />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  {person.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeam;

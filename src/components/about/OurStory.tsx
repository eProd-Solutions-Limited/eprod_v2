import { Sprout } from "lucide-react";

const OurStory = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-5">
              <Sprout size={28} className="text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Built from Necessity,{" "}
              <span className="gradient-primary-text">Forged in the Field</span>
            </h2>
          </div>

          <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
            <p>
              Our story doesn't begin in a boardroom; it begins in the field. In 2004, our founders were managing their own large-scale outgrower scheme in Kenya, facing the same frustrations our clients do today: fragmented data in spreadsheets, inefficient payment systems, and the constant struggle to prove compliance to buyers and banks.
            </p>
            <p>
              The existing software wasn't built for the realities of African agriculture—the remote locations, the intermittent connectivity, the complex payment structures. <strong className="text-foreground">So, they built their own solution.</strong> eProd was born from direct necessity.
            </p>
            <p>
              This origin is our DNA. We are not just software developers; we are agriculturalists who understand the grit and complexity of the first mile. This deep-rooted experience is why eProd is the most robust, adaptable, and user-centric platform on the market today.
            </p>
          </div>

          <div className="mt-10 bg-primary/5 border border-primary/10 rounded-xl p-6 text-center">
            <p className="text-lg font-bold text-foreground">
              "We didn't just build a product; we built the solution to our own problem."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;

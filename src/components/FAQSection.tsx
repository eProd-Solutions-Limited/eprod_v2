import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is eProd?",
    answer:
      "eProd is an agricultural supply chain management platform that helps agribusinesses manage farmer relationships, ensure traceability, achieve compliance, and unlock access to capital—all from one affordable system.",
  },
  {
    question: "How does eProd help de-risk agricultural lending?",
    answer:
      "eProd digitizes every farmer interaction, transaction, and harvest record. This verified data gives banks and financial institutions the transparency they need to assess risk accurately and extend credit to agribusinesses with confidence.",
  },
  {
    question: "Who is eProd designed for?",
    answer:
      "eProd is built for agribusinesses, cooperatives, exporters, and processors who manage supply chains with hundreds or thousands of smallholder farmers—particularly in emerging markets across Africa.",
  },
  {
    question: "How long does it take to set up eProd?",
    answer:
      "Most customers are fully onboarded within 4 weeks. Setup takes about 1 week, team and farmer training takes 2 weeks, and system integration takes another week. Customers typically see results within 30 days of launch.",
  },
  {
    question: "Does eProd work in areas with low internet connectivity?",
    answer:
      "Yes. eProd is specifically built for emerging markets and works reliably in low-connectivity environments. The mobile app supports offline data capture with automatic syncing when connectivity is restored.",
  },
  {
    question: "What kind of ROI can I expect from eProd?",
    answer:
      "Customers report up to 30% waste reduction, 85% efficiency improvement in operations, and over $50,000 in annual savings. Our 95% retention rate speaks to the long-term value eProd delivers.",
  },
  {
    question: "How is eProd different from generic farm management software?",
    answer:
      "Unlike generic tools, eProd is purpose-built for agricultural supply chains in emerging markets. It includes built-in compliance for export certification, farmer-centric mobile tools, bank-ready reporting for loan de-risking, and local support—all at a fraction of enterprise cost.",
  },
  {
    question: "Does eProd integrate with my existing systems?",
    answer:
      "Yes. eProd integrates with existing ERP, accounting, and communication systems. During onboarding, our team helps connect your current tools so eProd becomes your central hub without disrupting workflows.",
  },
];

const FAQSection = () => {
  // Generate JSON-LD FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Frequently Asked{" "}
          <span className="gradient-primary-text">Questions</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Everything you need to know about eProd and how it transforms agricultural supply chains.
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-foreground font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

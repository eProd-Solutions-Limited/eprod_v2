'use client'

import { Linkedin, Twitter, Facebook, Youtube, Shield, Lock, FileCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/LanguageProvider";

const Footer = () => {
  const { t } = useI18n();
  return (
    <div className="gradient-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">{t.footer.product}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/solutions" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.solutions}</a></li>
              <li><a href="/solutions#platform-architecture" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.features}</a></li>
              <li><a href="/sectors" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.sectors}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">{t.footer.company}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.aboutUs}</a></li>
              <li><a href="/about#team" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.team}</a></li>
              <li><a href="/about#careers" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.careers}</a></li>
              <li><a href="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.contact}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">{t.footer.resources}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/insights" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.insights}</a></li>
              <li><a href="/case-studies" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.caseStudies}</a></li>
              <li><a href="/events" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.events}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">{t.footer.legalConnect}</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.privacy}</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">{t.footer.terms}</a></li>
            </ul>
            <div className="flex gap-3">
              <a href="https://www.linkedin.com/company/eprod-solutions-limited/posts/?feedView=all" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition">
                <Linkedin size={16} />
              </a>
              <a href="https://twitter.com/eProdSolutions" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition">
                <Twitter size={16} />
              </a>
              <a href="https://www.facebook.com/eProdSolutions" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition">
                <Facebook size={16} />
              </a>
              <a href="https://www.youtube.com/@eprodsolutionslimited3557" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition">
                <Youtube size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} eProd Solutions. {t.footer.rights}
        </div>
      </div>
    </div>
  );
};

export default Footer;

import { Linkedin, Twitter, Facebook, Youtube, Shield, Lock, FileCheck } from "lucide-react";

const Footer = () => {
  return (
    <div className="gradient-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/solutions" className="text-primary-foreground/80 hover:text-primary-foreground transition">Solutions</a></li>
              <li><a href="/solutions#platform-architecture" className="text-primary-foreground/80 hover:text-primary-foreground transition">Features</a></li>
              <li><a href="/sectors" className="text-primary-foreground/80 hover:text-primary-foreground transition">Sectors</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition">About Us</a></li>
              <li><a href="/about#team" className="text-primary-foreground/80 hover:text-primary-foreground transition">Team</a></li>
              <li><a href="/about#careers" className="text-primary-foreground/80 hover:text-primary-foreground transition">Careers</a></li>
              <li><a href="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/insights" className="text-primary-foreground/80 hover:text-primary-foreground transition">Insights</a></li>
              <li><a href="/case-studies" className="text-primary-foreground/80 hover:text-primary-foreground transition">Case Studies</a></li>
              <li><a href="/events" className="text-primary-foreground/80 hover:text-primary-foreground transition">Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">Legal & Connect</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Terms of Service</a></li>
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
          © {new Date().getFullYear()} eProd Solutions. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;

import { Linkedin, Twitter, Facebook, Youtube, Shield, Lock, FileCheck } from "lucide-react";

const Footer = () => {
  return (
    <div className="gradient-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Solutions</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Features</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Pricing</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">About Us</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Team</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Careers</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Blog</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Case Studies</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Documentation</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Webinars</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/60">Legal & Connect</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition">Terms of Service</a></li>
            </ul>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition">
                <Youtube size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Lock size={14} /> SSL Secure
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <Shield size={14} /> ISO 27001 Certified
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/60">
            <FileCheck size={14} /> Data Protection Compliant
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

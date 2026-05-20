'use client';
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { Menu, X } from "lucide-react";


const navLinks=  [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/solutions", label: "Solutions" },
        { href: "/case-studies", label: "Case studies" },
        { href: "/insights", label: "Insights" },
        { href: "/contact", label: "Contact"},
    ];


const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="/" className="flex items-center">
          <img src="/e-prod_Logo.png" alt="eProd" className="h-20 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} className="text-secondary" />
          <span>Nairobi, Kenya</span>
          <Phone size={14} className="ml-3 text-secondary" />
          <span>+254112203982</span>
          <Mail size={14} className="ml-3 text-secondary" />
          <span>info@eprod-solutions.com</span>
        </div>
      </div>

      <nav className="gradient-primary">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const href = link.href;
              return (
                <li key={link.label}>
                  <a
                    href={href}
                    className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#cta"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground hover:brightness-110 transition"
          >
            Request a Demo
          </a>

          <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            {navLinks.map((link) => {
              const href = link.href;
              return (
                <a
                  key={link.label}
                  href={href}
                  className="block text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground py-1"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground mt-2"
            >
              Request a Demo
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

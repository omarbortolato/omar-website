import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const socialLinks = [
  { href: "https://github.com/omarbortolato", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/omarbortolato", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com/omarbortolato", icon: Twitter, label: "Twitter" },
  { href: "mailto:hello@omarbortolato.dev", icon: Mail, label: "Email" },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/progetti", label: "Progetti" },
  { href: "/blog", label: "Blog" },
  { href: "/collabora", label: "Collabora" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-primary-800"
            >
              Omar Bortolato
            </Link>
            <p className="mt-1 text-sm text-gray-500">
              Costruiamo qualcosa di bello insieme.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex gap-4 flex-wrap justify-center">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 hover:text-primary-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-md text-gray-400 hover:text-primary-800 hover:bg-white transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Omar Bortolato. Built with Next.js &amp; Tailwind CSS.
        </div>
      </div>
    </footer>
  );
}

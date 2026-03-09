import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Collabora",
  description: "Iniziamo a lavorare insieme. Hai un progetto? Parliamone.",
};

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@omarbortolato.dev",
    href: "mailto:hello@omarbortolato.dev",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/omarbortolato",
    href: "https://linkedin.com/in/omarbortolato",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/omarbortolato",
    href: "https://github.com/omarbortolato",
  },
];

export default function CollaboraPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-20">
      <Badge variant="accent" className="mb-4">Collabora</Badge>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Lavoriamo insieme
      </h1>
      <p className="text-gray-600 leading-relaxed mb-12 max-w-xl">
        Sono sempre aperto a nuove collaborazioni, freelance o consulenze.
        Hai un progetto interessante? Scrivimi, sono curioso di sentire cosa hai in mente.
      </p>

      <div className="space-y-4">
        {contactLinks.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 rounded-xl border border-border/40 p-4 hover:border-primary-800/40 hover:bg-primary-50/50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-800/10 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-primary-800" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-sm font-medium text-gray-800 group-hover:text-primary-800 transition-colors">
                {value}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

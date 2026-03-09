import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Progetti",
  description: "Una selezione dei progetti a cui ho lavorato.",
};

const projects = [
  {
    title: "Progetto Alpha",
    description: "Descrizione del progetto. Cosa fa, quale problema risolve e le tecnologie utilizzate.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    demo: "#",
    repo: "#",
  },
  {
    title: "Progetto Beta",
    description: "Descrizione del progetto. Cosa fa, quale problema risolve e le tecnologie utilizzate.",
    tags: ["React", "Node.js", "PostgreSQL"],
    demo: "#",
    repo: "#",
  },
  {
    title: "Progetto Gamma",
    description: "Descrizione del progetto. Cosa fa, quale problema risolve e le tecnologie utilizzate.",
    tags: ["TypeScript", "API REST", "Docker"],
    demo: "#",
    repo: null,
  },
];

export default function ProgettiPage() {
  return (
    <section className="container mx-auto max-w-5xl px-4 py-20">
      <Badge variant="accent" className="mb-4">Progetti</Badge>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Il mio lavoro</h1>
      <p className="text-gray-500 mb-12 max-w-xl">
        Una selezione di progetti personali, collaborazioni e lavori open source.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button asChild size="sm" variant="default">
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} />
                  Demo
                </a>
              </Button>
              {project.repo && (
                <Button asChild size="sm" variant="outline">
                  <a href={project.repo} target="_blank" rel="noopener noreferrer">
                    <Github size={14} />
                    Codice
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

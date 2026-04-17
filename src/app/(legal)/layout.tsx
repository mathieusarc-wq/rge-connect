import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header simple */}
      <header className="border-b border-forest-100 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-0">
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              RGE&nbsp;C
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-gold-500">
              O
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              NNECT
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-xs font-body text-ink-500">
            <Link href="/cgv-sous-traitant" className="hover:text-ink-700 transition-colors">
              CGV Sous-traitant
            </Link>
            <Link href="/cgv-installateur" className="hover:text-ink-700 transition-colors">
              CGV Installateur
            </Link>
            <Link href="/privacy" className="hover:text-ink-700 transition-colors">
              Confidentialité
            </Link>
            <Link href="/mentions-legales" className="hover:text-ink-700 transition-colors">
              Mentions légales
            </Link>
          </nav>
        </div>
      </header>

      {/* Avertissement dev */}
      <div className="bg-gold-500/10 border-b border-gold-300/30">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-gold-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-xs font-body text-ink-700 leading-relaxed">
            <strong className="font-semibold">Document provisoire</strong> — en cours de validation par avocat marketplace BTP. Pour toute interprétation contraignante, contacter{" "}
            <a href="mailto:legal@rge-connect.fr" className="font-semibold text-forest-700 hover:underline">
              legal@rge-connect.fr
            </a>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <article className="prose prose-sm sm:prose-base max-w-none prose-headings:font-display prose-headings:text-ink-900 prose-headings:tracking-tight prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-2 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-base prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2 prose-p:text-ink-700 prose-p:leading-relaxed prose-li:text-ink-700 prose-strong:text-ink-900 prose-a:text-forest-600 prose-a:no-underline hover:prose-a:underline">
          {children}
        </article>
      </main>

      {/* Footer simple */}
      <footer className="border-t border-forest-100 bg-white mt-12">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center">
          <p className="text-xs font-body text-ink-500">
            © {new Date().getFullYear()} RGE Connect — Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

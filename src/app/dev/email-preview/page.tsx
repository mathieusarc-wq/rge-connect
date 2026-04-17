import { promises as fs } from "node:fs";
import path from "node:path";

export const metadata = {
  title: "Preview email — RGE Connect",
};

// Page de preview des templates email (dev only, pas linkée)
export default async function EmailPreviewPage() {
  const filePath = path.join(
    process.cwd(),
    "supabase/email-templates/confirmation.html"
  );
  let rawHtml: string;
  try {
    rawHtml = await fs.readFile(filePath, "utf8");
  } catch {
    rawHtml =
      "<p>Template introuvable. Vérifie que supabase/email-templates/confirmation.html existe.</p>";
  }

  // Remplace les variables Supabase par des valeurs mock pour le preview
  const mocked = rawHtml
    .replace(
      /\{\{\s*\.SiteURL\s*\}\}\/activate\?token_hash=\{\{\s*\.TokenHash\s*\}\}&type=signup/g,
      "https://rge-connect.vercel.app/activate?token_hash=MOCK_TOKEN_PREVIEW&type=signup"
    )
    .replace(/\{\{\s*\.SiteURL\s*\}\}/g, "https://rge-connect.vercel.app")
    .replace(/\{\{\s*\.TokenHash\s*\}\}/g, "MOCK_TOKEN_PREVIEW")
    .replace(/\{\{\s*\.Email\s*\}\}/g, "mathieu.sarc@gmail.com")
    .replace(/\{\{\s*\.Token\s*\}\}/g, "123456")
    .replace(/\{\{.*?\}\}/g, ""); // clean remaining

  return (
    <div className="min-h-screen bg-gray-200 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 rounded-lg bg-white border border-forest-100 p-5 shadow-sm">
          <h1 className="text-xl font-display font-bold text-ink-900 mb-2">
            Preview · Email de création de compte
          </h1>
          <p className="text-sm font-body text-ink-500 mb-4">
            Rendu du template utilisé par Supabase lors de l&apos;inscription.
            Variables mockées pour le preview.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="rounded-md bg-cream-100 px-3 py-2">
              <span className="text-ink-400">Expéditeur :</span><br />
              <span className="text-ink-700">noreply@mail.app.supabase.io</span>
            </div>
            <div className="rounded-md bg-cream-100 px-3 py-2">
              <span className="text-ink-400">Sujet :</span><br />
              <span className="text-ink-700">Active ton compte RGE Connect</span>
            </div>
            <div className="rounded-md bg-cream-100 px-3 py-2">
              <span className="text-ink-400">Destinataire :</span><br />
              <span className="text-ink-700">mathieu.sarc@gmail.com</span>
            </div>
          </div>
        </div>

        {/* iframe avec le HTML — isolation complète du CSS parent */}
        <div className="rounded-lg overflow-hidden shadow-md bg-white">
          <iframe
            srcDoc={mocked}
            className="w-full"
            style={{ height: "1400px", border: "none" }}
            title="Email preview"
          />
        </div>

        <p className="mt-6 text-center text-xs font-body text-ink-500">
          Source : <code className="bg-white px-1.5 py-0.5 rounded">supabase/email-templates/confirmation.html</code>
        </p>
      </div>
    </div>
  );
}

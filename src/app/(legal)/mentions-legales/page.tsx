export const metadata = {
  title: "Mentions légales — RGE Connect",
  description: "Informations légales relatives à l'éditeur et à l'hébergeur du site RGE Connect.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700">
        Mise à jour le 17 avril 2026
      </p>
      <h1>Mentions légales</h1>
      <p className="text-ink-500 text-sm">
        Conformes aux articles 6 III-1 de la loi n° 2004-575 du 21 juin 2004 (LCEN) et L.111-1 du Code de la consommation.
      </p>

      <h2>Éditeur du site</h2>
      <p>
        <strong>MS Distribution</strong> — nom commercial <em>ELI Solution</em>, exploitant la marque <strong>RGE Connect</strong>
        <br />
        Forme juridique : Société par Actions Simplifiée (SAS)
        <br />
        Capital social : 10 000 €
        <br />
        Siège social : 16 Place des Quinconces, 33000 Bordeaux, France
        <br />
        RCS Bordeaux — SIREN 101 189 165
        <br />
        SIRET siège : 10118916500018
        <br />
        Code APE : 62.01Z (Programmation informatique)
        <br />
        Numéro TVA intracommunautaire : FR90101189165
        <br />
        Date de création : 12 février 2026
        <br />
        Président : Mathieu Sarciat
      </p>
      <p>
        Email : <a href="mailto:contact@rge-connect.fr">contact@rge-connect.fr</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>
        Mathieu Sarciat, en qualité de Président de MS Distribution.
      </p>

      <h2>Hébergeur</h2>
      <p>
        <strong>Vercel Inc.</strong>
        <br />
        440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
        <br />
        Site : <a href="https://vercel.com" target="_blank" rel="noreferrer">vercel.com</a>
      </p>
      <p>
        Infrastructure de base de données : <strong>Supabase</strong> (Supabase Inc.), localisée en Union Européenne (région Francfort, Allemagne).
      </p>

      <h2>Prestataire de services de paiement</h2>
      <p>
        <strong>Mangopay SA</strong>, établissement de monnaie électronique agréé, représenté par Mangopay France.
        <br />
        Siège : Luxembourg
        <br />
        Numéro CSSF : 2019 / 06 / 31
        <br />
        Site : <a href="https://www.mangopay.com" target="_blank" rel="noreferrer">mangopay.com</a>
      </p>

      <h2>Signature et horodatage</h2>
      <p>
        <strong>Yousign</strong> — Prestataire de services de confiance qualifié eIDAS pour la signature électronique.
        <br />
        <strong>Universign</strong> — Prestataire de services de confiance qualifié eIDAS pour l&apos;horodatage.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu de la Plateforme (textes, graphismes, logos, icônes, images, vidéos, sons, ainsi que leur mise en forme) est la propriété exclusive de RGE Connect SASU, à l&apos;exception des marques, logotypes ou contenus appartenant à d&apos;autres sociétés partenaires ou auteurs.
      </p>
      <p>
        Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces éléments est strictement interdite sans autorisation écrite préalable.
      </p>

      <h2>Crédits</h2>
      <ul>
        <li>Cartes : <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a> et <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>.</li>
        <li>Icônes : <a href="https://lucide.dev" target="_blank" rel="noreferrer">Lucide Icons</a> (licence ISC).</li>
        <li>Typographies : Sora, Inter, JetBrains Mono (Google Fonts, Open Font License).</li>
      </ul>

      <h2>Données personnelles</h2>
      <p>
        Les modalités de traitement des données personnelles sont détaillées dans la <a href="/privacy">politique de confidentialité</a>.
      </p>

      <h2>Conditions générales</h2>
      <ul>
        <li><a href="/cgv-sous-traitant">CGV Sous-traitant</a></li>
        <li><a href="/cgv-installateur">CGV Installateur</a></li>
      </ul>

      <h2>Médiation</h2>
      <p>
        Conformément à l&apos;article L.612-1 du Code de la consommation, la Plateforme étant strictement réservée aux professionnels (B2B), la médiation de la consommation ne s&apos;applique pas. Pour les litiges entre professionnels, la Plateforme privilégie la médiation interne (délai de 10 jours ouvrés) avant toute action contentieuse.
      </p>

      <h2>Droit applicable et juridiction</h2>
      <p>
        Le présent site et ses conditions d&apos;utilisation sont soumis au droit français. Toute contestation sera de la compétence exclusive des tribunaux français du ressort du siège de l&apos;Éditeur.
      </p>

      <hr />
      <p className="text-xs text-ink-400 mt-12">
        Contact général : <a href="mailto:contact@rge-connect.fr">contact@rge-connect.fr</a>
        <br />
        Service juridique : <a href="mailto:legal@rge-connect.fr">legal@rge-connect.fr</a>
        <br />
        DPO : <a href="mailto:dpo@rge-connect.fr">dpo@rge-connect.fr</a>
      </p>
    </>
  );
}

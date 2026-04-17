export const metadata = {
  title: "CGV Installateur — RGE Connect",
  description:
    "Conditions générales applicables aux installateurs ENR utilisant la marketplace RGE Connect.",
};

export default function CgvInstallateurPage() {
  return (
    <>
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700">
        Version 1.0 — En vigueur au 17 avril 2026
      </p>
      <h1>Conditions Générales Installateur</h1>
      <p className="text-ink-500 text-sm">
        Version applicable aux sociétés installatrices d&apos;équipements ENR utilisant la marketplace RGE Connect pour confier la pose à des artisans sous-traitants.
      </p>

      <h2>Préambule</h2>
      <p>
        RGE Connect est une marketplace B2B qui permet à des installateurs de solutions ENR (pompes à chaleur, photovoltaïque, climatisation, ITE, isolation) de confier la pose de leurs installations à des artisans RGE certifiés, tout en orchestrant le suivi du chantier, les paiements sécurisés par séquestre Mangopay, et la conformité documentaire.
      </p>
      <p>
        Les présentes Conditions Générales (ci-après les « <strong>CGV Installateur</strong> ») régissent l&apos;accès et l&apos;utilisation de la plateforme RGE Connect par toute personne morale (ci-après « <strong>l&apos;Installateur</strong> ») agissant dans le cadre de son activité professionnelle.
      </p>

      <h2>Article 1 — Définitions</h2>
      <ul>
        <li><strong>Plateforme</strong> : le site rge-connect.fr, les applications associées et l&apos;API.</li>
        <li><strong>Éditeur</strong> : la société MS Distribution, éditrice de la Plateforme.</li>
        <li><strong>Installateur</strong> : la personne morale inscrite sur la Plateforme, titulaire d&apos;un contrat de vente avec un Client final et confiant la pose à un Sous-traitant.</li>
        <li><strong>Sous-traitant</strong> : l&apos;artisan RGE sélectionné via la Plateforme pour exécuter la pose.</li>
        <li><strong>Client final</strong> : le bénéficiaire de la prestation (particulier ou professionnel).</li>
        <li><strong>Mission</strong> : chantier publié par l&apos;Installateur sur la Marketplace.</li>
        <li><strong>API</strong> : interface de programmation applicative permettant à l&apos;Installateur d&apos;intégrer la Plateforme depuis son propre CRM.</li>
        <li><strong>Mangopay</strong> : prestataire de services de paiement agréé, gérant les flux financiers et le séquestre.</li>
      </ul>

      <h2>Article 2 — Acceptation</h2>
      <p>
        L&apos;inscription sur la Plateforme vaut acceptation pleine et entière des présentes CGV. Les présentes sont complétées par les conditions particulières éventuellement signées avec l&apos;Installateur (plan Enterprise notamment).
      </p>

      <h2>Article 3 — Conditions d&apos;inscription</h2>
      <p>L&apos;accès à la Plateforme est réservé aux personnes morales :</p>
      <ul>
        <li>immatriculées au RCS avec un SIRET valide ;</li>
        <li>disposant d&apos;une activité compatible avec la distribution ou l&apos;installation d&apos;équipements ENR ;</li>
        <li>titulaires d&apos;une assurance responsabilité civile professionnelle couvrant l&apos;activité ;</li>
        <li>à jour de leurs obligations fiscales et sociales.</li>
      </ul>

      <h3>Documents requis pour le KYC Mangopay</h3>
      <ul>
        <li>Extrait Kbis de moins de 3 mois ;</li>
        <li>Pièce d&apos;identité du représentant légal ;</li>
        <li>Justificatif de domicile du représentant légal de moins de 3 mois ;</li>
        <li>RIB professionnel au nom de la société ;</li>
        <li>Attestation RC pro en cours de validité.</li>
      </ul>

      <h2>Article 4 — Abonnement et plans</h2>
      <ul>
        <li><strong>Découverte</strong> — 0 € : 3 missions par mois maximum, dashboard basique. Accès limité à la fonctionnalité test. Commission 3 %.</li>
        <li><strong>Business</strong> — 199 € HT par mois : missions illimitées, API et intégration CRM, SAV unique RGE Connect, garantie chantier (remplacement sous 48h), dashboard + reporting, centrale d&apos;achat fournisseurs négociés. Commission 3 %.</li>
        <li><strong>Enterprise</strong> — 499 € HT par mois (ou sur devis) : tout Business + marque blanche, décennale parapluie en option, account manager dédié, SLA 24/7, conditions particulières négociables. Commission 3 %.</li>
      </ul>
      <p>L&apos;abonnement est prélevé par SEPA B2B le 1<sup>er</sup> de chaque mois. Il est sans engagement pour les plans Découverte et Business (résiliable à tout moment avec effet à la fin de la période en cours). Le plan Enterprise peut faire l&apos;objet d&apos;un engagement contractuel spécifique.</p>

      <h2>Article 5 — Commission par mission</h2>
      <p>
        Une commission fixe de <strong>3 % du montant HT</strong> est prélevée par la Plateforme à l&apos;occasion du reversement du Sous-traitant, sans coût supplémentaire pour l&apos;Installateur. La commission est clairement affichée avant toute publication de mission.
      </p>

      <h2>Article 6 — Mandat SEPA B2B</h2>
      <p>
        L&apos;Installateur signe électroniquement un mandat de prélèvement SEPA B2B via Yousign lors de son inscription KYC. Ce mandat autorise l&apos;Éditeur et son partenaire Mangopay à prélever les montants dus au Sous-traitant sur le compte bancaire professionnel de l&apos;Installateur.
      </p>
      <p>
        <strong>Attention :</strong> contrairement au SEPA Core applicable aux particuliers, le mandat SEPA B2B ne prévoit <strong>pas de droit au remboursement</strong> après exécution du prélèvement. L&apos;Installateur dispose d&apos;un délai maximal de 1 jour ouvré pour contester un prélèvement auprès de sa banque, conformément aux règles de l&apos;EPC (European Payments Council).
      </p>

      <h2>Article 7 — Création et diffusion des missions</h2>
      <h3>7.1 Création</h3>
      <p>L&apos;Installateur crée une Mission via le formulaire web ou l&apos;API. Il garantit l&apos;exactitude des informations fournies : identité et coordonnées du Client final, adresse du chantier, type de prestation, équipement, montant HT / TTC, délais souhaités.</p>

      <h3>7.2 Consentement du Client final</h3>
      <p>L&apos;Installateur atteste avoir recueilli le consentement éclairé du Client final pour :</p>
      <ul>
        <li>la sous-traitance de la pose ;</li>
        <li>le partage de ses coordonnées avec la Plateforme et le Sous-traitant désigné dans l&apos;unique but de l&apos;exécution de la prestation ;</li>
        <li>la signature électronique du PV de réception via Yousign ;</li>
        <li>l&apos;envoi d&apos;une demande d&apos;avis après exécution.</li>
      </ul>

      <h3>7.3 Diffusion</h3>
      <p>
        La Plateforme diffuse automatiquement la mission aux Sous-traitants éligibles selon les critères publics : zone géographique, qualifications RGE requises, disponibilité, score qualité. L&apos;Installateur ne peut pas désigner un Sous-traitant hors Plateforme.
      </p>

      <h2>Article 8 — Paiement et séquestre</h2>
      <h3>8.1 Flux</h3>
      <p>
        L&apos;Installateur s&apos;engage à régler le montant HT de la mission au Sous-traitant, via le mécanisme de prélèvement SEPA B2B automatique géré par Mangopay, selon le délai choisi lors de la création de la mission (J+15, J+30, J+45 après la signature du PV de réception). Les fonds transitent par un compte séquestre ouvert au nom de la relation Installateur / Sous-traitant.
      </p>

      <h3>8.2 Commission</h3>
      <p>
        La commission RGE Connect de 3 % est prélevée au moment du reversement vers le wallet du Sous-traitant. L&apos;Installateur reçoit une facture mensuelle consolidant l&apos;abonnement et les commissions prélevées sur le mois.
      </p>

      <h3>8.3 Impayé</h3>
      <p>
        En cas d&apos;échec du prélèvement SEPA B2B (provision insuffisante, compte clôturé, mandat révoqué), l&apos;Éditeur avance la somme due au Sous-traitant dans le cadre de sa fonction d&apos;agent de paiement, et se substitue à l&apos;Installateur dans le recouvrement de la créance. L&apos;Installateur supporte alors des frais de recouvrement forfaitaires de 40 € HT ainsi que des intérêts de retard calculés au taux BCE + 10 points, conformément à l&apos;article L.441-10 du Code de commerce.
      </p>

      <h2>Article 9 — Garantie chantier (plans Business et Enterprise)</h2>
      <p>En cas de défaillance du Sous-traitant désigné (annulation moins de 72h avant le chantier, absence non justifiée, abandon de chantier), l&apos;Éditeur s&apos;engage à :</p>
      <ul>
        <li>proposer un Sous-traitant de remplacement sous 48 heures ouvrées dans un rayon de 50 km ;</li>
        <li>prendre en charge les frais supplémentaires éventuels dans la limite de 10 % du montant HT de la mission.</li>
      </ul>
      <p>Cette garantie ne s&apos;applique pas au plan Découverte.</p>

      <h2>Article 10 — Obligations de l&apos;Installateur</h2>
      <p>L&apos;Installateur s&apos;engage à :</p>
      <ul>
        <li>communiquer au Client final, avant la pose, le nom et les qualifications du Sous-traitant désigné ;</li>
        <li>ne pas contacter directement le Sous-traitant désigné hors de la Plateforme en vue de contourner les commissions, sous peine de pénalité équivalente à 25 % du montant HT de la mission ;</li>
        <li>déposer les DICT et préavis préalables requis par la réglementation ;</li>
        <li>gérer la facturation au Client final et la déclaration des aides (MaPrimeRénov&apos;, CEE) sous sa seule responsabilité ;</li>
        <li>répondre aux éventuelles réclamations du Client final relatives à la partie contractuelle Installateur-Client (contrat de vente, financement, commercialisation) ;</li>
        <li>signaler à l&apos;Éditeur tout incident ou anomalie sur la prestation sous 48 heures.</li>
      </ul>

      <h2>Article 11 — Responsabilités croisées</h2>
      <p>
        La relation Installateur ↔ Client final reste sous l&apos;entière responsabilité de l&apos;Installateur (contrat de vente, financement, commercialisation, aides). La relation Installateur ↔ Sous-traitant est contractée via la Plateforme mais les responsabilités techniques de la pose incombent au Sous-traitant (décennale, règles de l&apos;art). L&apos;Éditeur n&apos;est pas partie à ces contrats.
      </p>

      <h2>Article 12 — API et intégration CRM</h2>
      <p>
        Les plans Business et Enterprise donnent accès à l&apos;API publique. Les clés API sont strictement personnelles. Toute fuite doit être signalée sous 24 heures et entraîne la révocation immédiate. L&apos;Installateur est seul responsable des appels effectués depuis ses clés.
      </p>
      <p>
        L&apos;usage de l&apos;API est soumis à des quotas (60 requêtes/minute pour Business, 120 pour Enterprise). Les webhooks sortants sont signés en HMAC-SHA256 ; l&apos;Installateur s&apos;engage à vérifier ces signatures côté réception.
      </p>

      <h2>Article 13 — Résiliation</h2>
      <h3>13.1 À l&apos;initiative de l&apos;Installateur</h3>
      <p>L&apos;Installateur peut résilier à tout moment depuis son espace (plans Découverte et Business). Les missions en cours restent dues jusqu&apos;à leur clôture.</p>

      <h3>13.2 À l&apos;initiative de l&apos;Éditeur</h3>
      <p>L&apos;Éditeur peut résilier avec effet immédiat et sans indemnité en cas de :</p>
      <ul>
        <li>impayé non régularisé après 30 jours ;</li>
        <li>fausse déclaration sur le Kbis, la RC pro ou les mentions commerciales ;</li>
        <li>réclamations répétées et sérieuses de Clients finaux sur les pratiques commerciales de l&apos;Installateur ;</li>
        <li>tentative de contournement de la Plateforme ;</li>
        <li>condamnation de l&apos;Installateur ou de son dirigeant pour pratique commerciale trompeuse.</li>
      </ul>

      <h2>Article 14 — Données personnelles</h2>
      <p>
        L&apos;Installateur et l&apos;Éditeur agissent en tant que <strong>responsables conjoints de traitement</strong> au sens de l&apos;article 26 du RGPD pour les données des Clients finaux collectées et traitées via la Plateforme, dans les limites de leurs responsabilités respectives définies aux présentes. Un avenant spécifique de responsabilité conjointe (article 26 RGPD) pourra être signé sur demande. Le détail du traitement figure dans la <a href="/privacy">politique de confidentialité</a>.
      </p>

      <h2>Article 15 — Propriété intellectuelle</h2>
      <p>
        La Plateforme (code, design, algorithmes, marque RGE Connect) est la propriété exclusive de l&apos;Éditeur. L&apos;Installateur n&apos;obtient qu&apos;une licence non exclusive, non transférable et limitée à la durée du contrat pour utiliser la Plateforme et l&apos;API.
      </p>

      <h2>Article 16 — Confidentialité</h2>
      <p>
        Chacune des parties s&apos;engage à tenir confidentielles les informations commerciales, techniques et financières de l&apos;autre partie, pendant toute la durée du contrat et 3 ans après son terme.
      </p>

      <h2>Article 17 — Force majeure</h2>
      <p>
        Aucune des parties ne pourra être tenue responsable d&apos;un manquement résultant d&apos;un cas de force majeure au sens de l&apos;article 1218 du Code civil.
      </p>

      <h2>Article 18 — Modifications des CGV</h2>
      <p>
        L&apos;Éditeur se réserve le droit de modifier les présentes CGV, notamment pour se conformer à une évolution réglementaire. Les modifications substantielles sont notifiées par email au moins 30 jours avant leur entrée en vigueur. La poursuite de l&apos;utilisation vaut acceptation.
      </p>

      <h2>Article 19 — Loi applicable et juridiction</h2>
      <p>
        Les présentes CGV sont régies par le droit français. Tout litige non résolu amiablement sera porté devant le Tribunal de Commerce du ressort du siège social de l&apos;Éditeur.
      </p>

      <hr />
      <p className="text-xs text-ink-400 mt-12">
        Pour toute question : <a href="mailto:legal@rge-connect.fr">legal@rge-connect.fr</a>
      </p>
    </>
  );
}

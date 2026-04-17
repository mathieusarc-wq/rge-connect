export const metadata = {
  title: "CGV Sous-traitant — RGE Connect",
  description:
    "Conditions générales applicables aux artisans sous-traitants RGE utilisant la marketplace RGE Connect.",
};

export default function CgvSousTraitantPage() {
  return (
    <>
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700">
        Version 1.0 — En vigueur au 17 avril 2026
      </p>
      <h1>Conditions Générales Sous-traitant</h1>
      <p className="text-ink-500 text-sm">
        Version applicable aux artisans RGE utilisant la marketplace RGE Connect.
      </p>

      <h2>Préambule</h2>
      <p>
        RGE Connect est une marketplace B2B qui met en relation des installateurs ENR (donneurs d&apos;ordre) et des artisans RGE (sous-traitants) pour l&apos;exécution de chantiers de rénovation énergétique en France métropolitaine. La plateforme est éditée par la société <strong>MS Distribution</strong> (SAS au capital de 10 000 €, RCS Bordeaux — SIREN 101 189 165, siège social 16 Place des Quinconces, 33000 Bordeaux), exploitant la marque « RGE Connect ». Elle intervient en qualité d&apos;intermédiaire technique et d&apos;agent de paiement via son partenaire Mangopay.
      </p>
      <p>
        Les présentes Conditions Générales (ci-après les « <strong>CGV Sous-traitant</strong> ») régissent l&apos;accès et l&apos;utilisation de la plateforme RGE Connect par tout artisan professionnel (personne physique ou morale) disposant du statut RGE et souhaitant accepter des missions via la plateforme.
      </p>

      <h2>Article 1 — Définitions</h2>
      <ul>
        <li><strong>Plateforme</strong> : le site rge-connect.fr et ses applications mobiles associées.</li>
        <li><strong>Éditeur</strong> : la société MS Distribution.</li>
        <li><strong>Sous-traitant</strong> : l&apos;artisan professionnel inscrit sur la Plateforme, titulaire d&apos;au moins une qualification RGE valide ou ayant déclaré exercer sans qualification RGE.</li>
        <li><strong>Installateur</strong> : le donneur d&apos;ordre qui publie une Mission.</li>
        <li><strong>Mission</strong> : chantier de rénovation énergétique créé par un Installateur et diffusé sur la Marketplace.</li>
        <li><strong>Client final</strong> : le particulier ou le professionnel chez qui la prestation est exécutée.</li>
        <li><strong>Mangopay</strong> : Prestataire de services de paiement agréé partenaire de la Plateforme.</li>
      </ul>

      <h2>Article 2 — Acceptation des CGV</h2>
      <p>
        L&apos;inscription sur la Plateforme vaut acceptation pleine et entière des présentes CGV. En cochant la case « J&apos;accepte les Conditions Générales d&apos;Utilisation », le Sous-traitant déclare avoir pris connaissance du présent document et s&apos;engage à le respecter.
      </p>

      <h2>Article 3 — Inscription et création de compte</h2>
      <h3>3.1 Conditions d&apos;inscription</h3>
      <p>L&apos;inscription est réservée aux professionnels immatriculés au Registre du Commerce et des Sociétés (RCS) ou au Répertoire des Métiers (RM) et pouvant justifier :</p>
      <ul>
        <li>d&apos;un SIRET valide en France métropolitaine ;</li>
        <li>d&apos;une activité principale compatible avec les prestations proposées sur la Plateforme ;</li>
        <li>d&apos;un compte bancaire au nom de la société ;</li>
        <li>d&apos;une assurance responsabilité civile professionnelle et d&apos;une assurance décennale en cours de validité.</li>
      </ul>

      <h3>3.2 Vérification d&apos;identité (KYC)</h3>
      <p>
        Conformément aux obligations du partenaire Mangopay et au Code Monétaire et Financier (articles L.561-1 et suivants), le Sous-traitant devra fournir :
      </p>
      <ul>
        <li>un extrait Kbis de moins de 3 mois ;</li>
        <li>une pièce d&apos;identité du représentant légal ;</li>
        <li>un RIB professionnel ;</li>
        <li>les attestations d&apos;assurance décennale et RC pro ;</li>
        <li>les attestations de qualification RGE déclarées ;</li>
        <li>une attestation URSSAF à jour.</li>
      </ul>
      <p>
        L&apos;accès à la Marketplace est conditionné à la validation de ces documents. L&apos;Éditeur se réserve le droit de suspendre un compte dont les documents seraient expirés ou non conformes.
      </p>

      <h2>Article 4 — Qualifications RGE et responsabilité</h2>
      <p>
        Le Sous-traitant garantit sur l&apos;honneur l&apos;authenticité des qualifications RGE déclarées et s&apos;engage à informer l&apos;Éditeur sous 7 jours de toute modification (suspension, retrait, renouvellement, ajout). L&apos;Éditeur vérifie périodiquement auprès de l&apos;annuaire officiel France Rénov&apos; la validité des qualifications.
      </p>
      <p>
        Toute fausse déclaration expose le Sous-traitant à la suspension immédiate de son compte, à la résiliation de ses missions en cours sans indemnité, et au signalement auprès des organismes certificateurs concernés et de la DGCCRF.
      </p>

      <h2>Article 5 — Abonnement et commissions</h2>
      <h3>5.1 Plans</h3>
      <ul>
        <li><strong>Standard</strong> — 79 € HT par mois : marketplace, photos horodatées, PV électronique, coffre-fort documentaire, avis automatiques.</li>
        <li><strong>Pro</strong> — 149 € HT par mois : tout Standard + garantie de paiement séquestre, catalogue fournisseurs négociés, assurances partenaires, republication Google Business Profile.</li>
      </ul>
      <p>L&apos;abonnement est prélevé par SEPA B2B le 1<sup>er</sup> de chaque mois. Il est sans engagement, résiliable à tout moment depuis le compte, avec effet à la fin de la période en cours.</p>

      <h3>5.2 Commission par mission</h3>
      <p>
        Une commission fixe et transparente de <strong>3 % du montant HT</strong> de la mission est prélevée par la Plateforme au moment du reversement du paiement au Sous-traitant. Cette commission est mentionnée explicitement à chaque publication de mission et dans le récapitulatif avant validation.
      </p>

      <h3>5.3 Affacturage express (optionnel, plan Pro)</h3>
      <p>
        Le Sous-traitant peut activer au cas par cas l&apos;option « Affacturage 48h » permettant de recevoir son paiement sous 48 heures suivant la validation du PV de réception, sans attendre le délai convenu avec l&apos;Installateur. Cette option donne lieu à une commission additionnelle fixe de <strong>10 % du montant HT</strong> de l&apos;opération, intégralement prélevée par l&apos;Éditeur et ses partenaires de cession de créance.
      </p>

      <h2>Article 6 — Missions</h2>
      <h3>6.1 Diffusion et matching</h3>
      <p>
        La Plateforme sélectionne automatiquement, pour chaque mission publiée par un Installateur, les Sous-traitants éligibles selon plusieurs critères objectifs : zone géographique d&apos;intervention déclarée, qualifications RGE requises, capacité de charge, score de qualité, documents à jour. Les critères de classement sont publics et accessibles depuis le profil.
      </p>

      <h3>6.2 Acceptation de mission</h3>
      <p>
        Le Sous-traitant peut proposer jusqu&apos;à 5 créneaux d&apos;intervention en un clic. Le Client final sélectionne son créneau via un lien sécurisé tokenisé envoyé par email et SMS. La mission est considérée comme contractée dès la sélection du créneau par le Client final.
      </p>

      <h3>6.3 Exécution du chantier</h3>
      <p>Le Sous-traitant exécute la prestation conformément aux règles de l&apos;art, aux normes en vigueur (DTU, NF), aux obligations de qualification RGE, et dans le respect des délais convenus. Il s&apos;engage à :</p>
      <ul>
        <li>prendre des photos horodatées eIDAS avant, pendant et après le chantier via l&apos;application RGE Connect ;</li>
        <li>faire signer un procès-verbal de réception électronique au Client final ;</li>
        <li>transmettre les factures et justificatifs nécessaires à l&apos;éligibilité aux aides (MaPrimeRénov&apos;, CEE) si l&apos;Installateur les a sollicitées.</li>
      </ul>

      <h3>6.4 Annulation</h3>
      <p>
        Toute annulation d&apos;une mission acceptée par le Sous-traitant moins de 72 heures avant le créneau convenu donne lieu à une pénalité forfaitaire de 150 € HT, prélevée sur le wallet Mangopay, au profit de l&apos;Installateur en compensation du préjudice. Les annulations pour force majeure (hospitalisation, décès, intempéries majeures) sont exonérées sur justificatif.
      </p>

      <h2>Article 7 — Paiement et séquestre</h2>
      <h3>7.1 Modalités</h3>
      <p>
        Le paiement de la prestation est confié à Mangopay, prestataire de services de paiement agréé par l&apos;ACPR. Il transite par un compte séquestre ouvert au nom de la relation contractuelle Installateur / Sous-traitant. Le Sous-traitant accepte expressément ce mécanisme et renonce à réclamer le paiement directement auprès du Client final.
      </p>

      <h3>7.2 Reversement</h3>
      <p>
        Le reversement intervient à l&apos;issue d&apos;un délai de 48 heures suivant la signature du procès-verbal de réception sans réserve par le Client final, déduction faite de la commission RGE Connect (3 %) et, le cas échéant, de la commission d&apos;affacturage (10 %). Les fonds sont crédités sur le wallet Mangopay du Sous-traitant, qui peut demander un virement vers son compte bancaire à tout moment.
      </p>

      <h3>7.3 Litige sur la prestation</h3>
      <p>
        En cas de contestation de la prestation par le Client final ou l&apos;Installateur, les fonds restent séquestrés jusqu&apos;à résolution amiable ou décision judiciaire. L&apos;Éditeur met à disposition un médiateur interne dans un délai de 10 jours ouvrés pour tenter une résolution.
      </p>

      <h2>Article 8 — Obligations du Sous-traitant</h2>
      <p>Le Sous-traitant s&apos;engage à :</p>
      <ul>
        <li>maintenir en vigueur ses assurances RC pro et décennale, et en fournir copie à tout moment sur demande ;</li>
        <li>respecter les règles de l&apos;art, normes DTU applicables et prescriptions du fabricant de matériel ;</li>
        <li>respecter les délais convenus ;</li>
        <li>traiter le Client final avec courtoisie et professionnalisme ;</li>
        <li>ne pas communiquer directement ses coordonnées bancaires ou ses prix au Client final dans l&apos;objectif de contourner la Plateforme (« <em>off-platform</em> »), sous peine de résiliation immédiate et de pénalité équivalente à 25 % du montant HT de la mission ;</li>
        <li>préserver la confidentialité des informations commerciales de l&apos;Installateur ;</li>
        <li>signaler à l&apos;Éditeur sous 48 heures tout incident, réclamation client ou dysfonctionnement du matériel installé.</li>
      </ul>

      <h2>Article 9 — Avis clients et score de qualité</h2>
      <p>
        Chaque mission clôturée donne lieu à une demande d&apos;avis automatique au Client final via email et SMS (Brevo). Les avis sont vérifiés (un avis par mission réellement exécutée) et non modifiables par le Sous-traitant. Un score global pondéré est calculé à partir de ces avis et des critères de performance (taux d&apos;acceptation, délais, conformité documentaire). Ce score conditionne la priorité d&apos;affichage des missions.
      </p>
      <p>
        Un Sous-traitant dont le score tombe durablement sous 3,0/5 ou dont le taux d&apos;annulation dépasse 20 % peut être placé en période probatoire ou voir son compte suspendu.
      </p>

      <h2>Article 10 — Responsabilité et limites</h2>
      <p>
        L&apos;Éditeur intervient exclusivement en qualité d&apos;intermédiaire technique et d&apos;agent de paiement. Il ne peut être tenu responsable :
      </p>
      <ul>
        <li>de la qualité technique de la prestation exécutée par le Sous-traitant ;</li>
        <li>des litiges commerciaux entre le Sous-traitant et le Client final hors de son mandat de séquestre ;</li>
        <li>des indisponibilités temporaires de la Plateforme liées à des opérations de maintenance ou à la force majeure (sous réserve d&apos;un SLA 99,5 % sur 12 mois glissants pour les plans Pro).</li>
      </ul>
      <p>
        La responsabilité éventuelle de l&apos;Éditeur envers le Sous-traitant est limitée, tous préjudices cumulés, au montant total des abonnements et commissions perçus au cours des 12 derniers mois.
      </p>

      <h2>Article 11 — Résiliation</h2>
      <h3>11.1 À l&apos;initiative du Sous-traitant</h3>
      <p>Le Sous-traitant peut résilier son compte à tout moment depuis l&apos;espace Paramètres, avec effet à la fin de la période d&apos;abonnement en cours. Les missions acceptées restent dues.</p>

      <h3>11.2 À l&apos;initiative de l&apos;Éditeur</h3>
      <p>L&apos;Éditeur peut résilier de plein droit, sans indemnité et après mise en demeure restée infructueuse 7 jours, en cas de :</p>
      <ul>
        <li>fausse déclaration sur les qualifications ou les documents ;</li>
        <li>retrait d&apos;une qualification RGE déclarée sans régularisation ;</li>
        <li>non-respect répété des règles de l&apos;art constaté par plusieurs clients ;</li>
        <li>tentative de contournement de la Plateforme ;</li>
        <li>impayés d&apos;abonnement pendant plus de 30 jours.</li>
      </ul>

      <h2>Article 12 — Données personnelles</h2>
      <p>
        Le traitement des données personnelles du Sous-traitant, de ses collaborateurs et des Clients finaux est effectué conformément au RGPD et à la politique de confidentialité disponible <a href="/privacy">ici</a>. L&apos;Éditeur et le Sous-traitant sont chacun responsables de traitement autonomes pour les données qu&apos;ils collectent et traitent.
      </p>

      <h2>Article 13 — Propriété intellectuelle</h2>
      <p>
        La marque « RGE Connect », le logo, le design, le code source, les algorithmes de matching et les textes de la Plateforme sont la propriété exclusive de l&apos;Éditeur. Toute reproduction ou utilisation non autorisée est strictement interdite.
      </p>
      <p>
        Le Sous-traitant conserve la propriété des contenus qu&apos;il publie (photos, commentaires, descriptions) mais concède à l&apos;Éditeur une licence non exclusive, mondiale et gratuite pour en permettre l&apos;affichage sur la Plateforme et les publications marketing associées, pour la durée de la relation contractuelle augmentée de 3 ans.
      </p>

      <h2>Article 14 — Force majeure</h2>
      <p>
        Aucune des parties ne pourra être tenue responsable d&apos;un manquement résultant d&apos;un cas de force majeure au sens de l&apos;article 1218 du Code civil (catastrophe naturelle, pandémie, cyberattaque majeure, décision d&apos;autorité publique, grève nationale).
      </p>

      <h2>Article 15 — Modification des CGV</h2>
      <p>
        L&apos;Éditeur se réserve le droit de modifier les présentes CGV. Toute modification substantielle est notifiée au Sous-traitant par email au moins 30 jours avant son entrée en vigueur. La poursuite de l&apos;utilisation de la Plateforme après cette date vaut acceptation.
      </p>

      <h2>Article 16 — Loi applicable et juridiction</h2>
      <p>
        Les présentes CGV sont soumises au droit français. Tout litige non résolu amiablement sera de la compétence exclusive du Tribunal de Commerce du ressort du siège social de l&apos;Éditeur, nonobstant pluralité de défendeurs ou appel en garantie.
      </p>

      <h2>Article 17 — Divers</h2>
      <p>
        Si une disposition des présentes CGV est réputée nulle, les autres dispositions conservent leur pleine validité. Le défaut d&apos;exercice d&apos;un droit par l&apos;Éditeur ne vaut pas renonciation à ce droit.
      </p>

      <hr />
      <p className="text-xs text-ink-400 mt-12">
        Pour toute question relative à ces CGV : <a href="mailto:legal@rge-connect.fr">legal@rge-connect.fr</a>
      </p>
    </>
  );
}

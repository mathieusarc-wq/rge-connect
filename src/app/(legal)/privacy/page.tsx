export const metadata = {
  title: "Politique de confidentialité — RGE Connect",
  description: "Traitement des données personnelles sur RGE Connect, conformité RGPD et CNIL.",
};

export default function PrivacyPage() {
  return (
    <>
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold-700">
        Version 1.0 — En vigueur au 17 avril 2026
      </p>
      <h1>Politique de confidentialité</h1>
      <p className="text-ink-500 text-sm">
        Conforme au Règlement (UE) 2016/679 (RGPD), à la Loi Informatique et Libertés modifiée, et aux recommandations de la CNIL.
      </p>

      <h2>1. Responsable de traitement</h2>
      <p>
        Le responsable du traitement des données personnelles est la société <strong>MS Distribution</strong>, SAS au capital de 10 000 €, immatriculée au RCS de Bordeaux sous le SIREN 101 189 165, dont le siège social est situé au 16 Place des Quinconces, 33000 Bordeaux — exploitant la marque <strong>RGE Connect</strong>.
      </p>
      <p>
        Contact du Délégué à la Protection des Données (DPO) : <a href="mailto:dpo@rge-connect.fr">dpo@rge-connect.fr</a>
        <br />
        Adresse postale DPO : MS Distribution — Service DPO, 16 Place des Quinconces, 33000 Bordeaux.
      </p>

      <h2>2. Données collectées</h2>

      <h3>2.1 Données fournies directement par l&apos;utilisateur</h3>
      <ul>
        <li><strong>Données de compte</strong> : prénom, nom, email, mot de passe (haché en bcrypt/argon2), téléphone.</li>
        <li><strong>Données d&apos;entreprise</strong> : raison sociale, SIRET, SIREN, adresse, code postal, ville, téléphone.</li>
        <li><strong>Documents professionnels</strong> : Kbis, RIB, RC pro, décennale, attestations RGE, URSSAF, carte BTP, pièce d&apos;identité du représentant légal.</li>
        <li><strong>Qualifications</strong> : RGE QualiPac, QualiPV, QualiBois, QualiSol CESI/SSC, Ventilation+, Qualibat ITE/ITI/Menuiserie.</li>
        <li><strong>Données de mission</strong> : coordonnées du Client final, adresse chantier, équipement, montants, photos, PV.</li>
      </ul>

      <h3>2.2 Données collectées automatiquement</h3>
      <ul>
        <li><strong>Données de connexion</strong> : adresse IP, date et heure de connexion, User-Agent, navigateur, système d&apos;exploitation.</li>
        <li><strong>Données de navigation</strong> : pages consultées, clics, interactions avec la Plateforme.</li>
        <li><strong>Géolocalisation</strong> : des photos horodatées eIDAS prises depuis l&apos;application mobile lors de l&apos;exécution des chantiers (avec consentement explicite de l&apos;utilisateur).</li>
        <li><strong>Logs de sécurité</strong> : tentatives d&apos;authentification, appels API, actions sensibles (audit trail).</li>
      </ul>

      <h3>2.3 Données collectées via des tiers</h3>
      <ul>
        <li><strong>API recherche-entreprises.api.gouv.fr</strong> (INSEE) : vérification d&apos;existence et d&apos;activité des entreprises inscrites à partir du SIRET.</li>
        <li><strong>Annuaire France Rénov&apos;</strong> : vérification de la validité des qualifications RGE déclarées.</li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <div className="overflow-x-auto">
        <table className="text-sm">
          <thead>
            <tr>
              <th className="text-left">Finalité</th>
              <th className="text-left">Base légale</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Gestion du compte utilisateur et authentification</td><td>Exécution du contrat (art. 6.1.b RGPD)</td></tr>
            <tr><td>Vérification d&apos;identité (KYC) pour Mangopay</td><td>Obligation légale (art. 6.1.c — Code monétaire et financier)</td></tr>
            <tr><td>Gestion des missions et mise en relation</td><td>Exécution du contrat</td></tr>
            <tr><td>Prélèvement SEPA B2B et paiement séquestre</td><td>Exécution du contrat</td></tr>
            <tr><td>Calcul du score qualité et matching</td><td>Intérêt légitime (art. 6.1.f)</td></tr>
            <tr><td>Horodatage eIDAS des photos de chantier</td><td>Exécution du contrat + obligation légale (preuve d&apos;exécution)</td></tr>
            <tr><td>Extraction IA des devis via Claude (Anthropic)</td><td>Exécution du contrat (service demandé par l&apos;utilisateur)</td></tr>
            <tr><td>Envoi de newsletters marketing</td><td>Consentement (art. 6.1.a) avec opt-in explicite et opt-out à tout moment</td></tr>
            <tr><td>Mesure d&apos;audience et amélioration du service</td><td>Intérêt légitime (mesure d&apos;audience exemptée de consentement par la CNIL si paramétrage approprié)</td></tr>
            <tr><td>Logs de sécurité et audit trail</td><td>Intérêt légitime (sécurité) et obligation légale (LCEN art. 6)</td></tr>
            <tr><td>Conservation des documents de mission</td><td>Obligation légale (prescription décennale — art. 1792 Code civil)</td></tr>
          </tbody>
        </table>
      </div>

      <h2>4. Destinataires et sous-traitants (article 28 RGPD)</h2>
      <p>Les données sont traitées par RGE Connect et par les sous-traitants suivants, chacun liés par un contrat de sous-traitance conforme à l&apos;article 28 du RGPD :</p>
      <div className="overflow-x-auto">
        <table className="text-sm">
          <thead>
            <tr>
              <th className="text-left">Sous-traitant</th>
              <th className="text-left">Finalité</th>
              <th className="text-left">Localisation</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Supabase (EU Frankfurt)</td><td>Base de données, authentification, stockage</td><td>Union Européenne (DE)</td></tr>
            <tr><td>Mangopay SA</td><td>Services de paiement, séquestre, wallets, KYC</td><td>France, Luxembourg</td></tr>
            <tr><td>Yousign</td><td>Signature électronique qualifiée eIDAS</td><td>France</td></tr>
            <tr><td>Universign</td><td>Horodatage qualifié eIDAS</td><td>France</td></tr>
            <tr><td>Brevo (ex-Sendinblue)</td><td>Emails transactionnels et marketing, SMS</td><td>France</td></tr>
            <tr><td>Vercel Inc.</td><td>Hébergement de la Plateforme, CDN</td><td>États-Unis (SCC + DPF)</td></tr>
            <tr><td>Anthropic, PBC</td><td>Extraction IA des devis (RGE Connect Vision)</td><td>États-Unis (SCC + zero data retention activé)</td></tr>
            <tr><td>API recherche-entreprises.api.gouv.fr</td><td>Vérification SIRET</td><td>France (DINUM)</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Transferts hors Union Européenne</h3>
      <p>
        Certains sous-traitants (Vercel, Anthropic) peuvent être amenés à traiter des données depuis les États-Unis. Ces transferts sont encadrés par les <strong>Clauses Contractuelles Types</strong> (Standard Contractual Clauses, décision CE 2021/914) et, pour Vercel et Anthropic, par leur adhésion au <strong>Data Privacy Framework</strong> (DPF) UE-US. Pour Anthropic, l&apos;option « <em>Zero Data Retention</em> » est activée contractuellement afin que les contenus envoyés à l&apos;API ne soient pas utilisés pour l&apos;entraînement des modèles ni conservés plus de 30 jours.
      </p>

      <h2>5. Durées de conservation</h2>
      <ul>
        <li><strong>Données de compte actif</strong> : tant que le compte est actif + 3 ans après la dernière activité (prospect commercial).</li>
        <li><strong>Données après résiliation</strong> : 3 ans à compter de la résiliation, puis archivage intermédiaire 5 ans.</li>
        <li><strong>Documents de mission</strong> : 10 ans à compter de la fin du chantier (prescription décennale des constructeurs — article 1792 Code civil).</li>
        <li><strong>Factures et documents comptables</strong> : 10 ans (Code de commerce art. L.123-22).</li>
        <li><strong>Données KYC Mangopay</strong> : 5 ans après la fin de la relation (LCB-FT — art. L.561-12 CMF).</li>
        <li><strong>Logs de sécurité et audit trail</strong> : 1 an (LCEN art. 6-II).</li>
        <li><strong>Cookies et traceurs</strong> : 13 mois maximum (recommandation CNIL).</li>
        <li><strong>Consentements marketing</strong> : 3 ans à compter du dernier contact actif.</li>
        <li><strong>Données des prospects non-utilisateurs</strong> (formulaires de contact) : 3 ans.</li>
      </ul>

      <h2>6. Sécurité des données</h2>
      <p>RGE Connect met en œuvre les mesures techniques et organisationnelles suivantes :</p>
      <ul>
        <li>Chiffrement des données en transit (TLS 1.3) et au repos (AES-256) ;</li>
        <li>Authentification forte via Supabase Auth (hachage bcrypt/argon2 des mots de passe, tokens PKCE) ;</li>
        <li>Politique de contrôle d&apos;accès stricte (RLS PostgreSQL sur toutes les tables) ;</li>
        <li>Journalisation des accès sensibles (audit logs append-only) ;</li>
        <li>Horodatage eIDAS des documents critiques ;</li>
        <li>Tests de sécurité réguliers et audits annuels ;</li>
        <li>Signature HMAC-SHA256 des webhooks sortants ;</li>
        <li>Protection anti-bot (Vercel BotID) sur les routes sensibles ;</li>
        <li>Rate limiting des endpoints API et d&apos;authentification ;</li>
        <li>Sauvegardes chiffrées quotidiennes conservées 30 jours.</li>
      </ul>

      <h2>7. Droits des personnes concernées</h2>
      <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d&apos;accès</strong> (art. 15) : obtenir la confirmation que vos données sont traitées et en recevoir une copie.</li>
        <li><strong>Droit de rectification</strong> (art. 16) : corriger les données inexactes ou incomplètes.</li>
        <li><strong>Droit à l&apos;effacement</strong> (art. 17) : demander la suppression de vos données, sous réserve des obligations légales de conservation.</li>
        <li><strong>Droit à la limitation</strong> (art. 18) : demander la suspension temporaire du traitement.</li>
        <li><strong>Droit à la portabilité</strong> (art. 20) : recevoir vos données dans un format structuré (JSON) pour les transmettre à un autre responsable de traitement.</li>
        <li><strong>Droit d&apos;opposition</strong> (art. 21) : s&apos;opposer au traitement fondé sur l&apos;intérêt légitime ou à des fins de prospection.</li>
        <li><strong>Droit de ne pas faire l&apos;objet d&apos;une décision entièrement automatisée</strong> (art. 22) : le matching des missions intègre une part d&apos;automatisation ; une intervention humaine peut être demandée.</li>
        <li><strong>Directives post-mortem</strong> (loi Informatique et Libertés art. 85) : définir le sort de vos données après votre décès.</li>
      </ul>
      <p>
        Pour exercer vos droits, adressez un email à <a href="mailto:dpo@rge-connect.fr">dpo@rge-connect.fr</a> avec la copie d&apos;une pièce d&apos;identité. Réponse sous 1 mois (prorogeable de 2 mois si complexité).
      </p>

      <h2>8. Cookies et traceurs</h2>
      <p>RGE Connect utilise les catégories de cookies suivantes :</p>
      <ul>
        <li><strong>Cookies strictement nécessaires</strong> (session, authentification, CSRF) : exemptés de consentement (art. 82 LIL).</li>
        <li><strong>Cookies de mesure d&apos;audience</strong> : paramétrés pour être exemptés de consentement selon les recommandations CNIL (anonymisation IP, pas de recoupement).</li>
        <li><strong>Cookies de personnalisation et marketing</strong> : soumis à consentement préalable via le bandeau dédié.</li>
      </ul>
      <p>
        Un bandeau de gestion des cookies permet d&apos;accepter, refuser ou paramétrer finement chaque catégorie. Le choix est révocable à tout moment depuis la page « Paramètres &gt; Confidentialité ».
      </p>

      <h2>9. Réclamation auprès de la CNIL</h2>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d&apos;introduire une réclamation auprès de la Commission Nationale de l&apos;Informatique et des Libertés :
      </p>
      <p className="text-sm">
        <strong>CNIL</strong> — 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">www.cnil.fr</a>
      </p>

      <h2>10. Mises à jour</h2>
      <p>
        La présente politique peut être mise à jour pour refléter les évolutions du service ou de la réglementation. Toute modification substantielle est notifiée par email et bandeau sur la Plateforme au moins 30 jours avant son entrée en vigueur.
      </p>

      <hr />
      <p className="text-xs text-ink-400 mt-12">
        Pour toute question : <a href="mailto:dpo@rge-connect.fr">dpo@rge-connect.fr</a>
      </p>
    </>
  );
}

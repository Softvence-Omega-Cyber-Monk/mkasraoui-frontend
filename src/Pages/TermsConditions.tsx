function TermsConditions() {
  return (
    <div>
      <div className="mx-auto max-w-4xl p-6 leading-relaxed text-gray-800">
        <h1 className="mb-6 text-3xl font-bold">
          Conditions Générales de Vente (CGV) – Ma Fête Facile
        </h1>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Article 1 - Objet</h2>
          <p>
            Les présentes CGV définissent les conditions applicables à toute
            utilisation du site Ma Fête Facile et à toute commande passée par un
            client (particulier ou professionnel).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Article 2 - Produits et services
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Des abonnements (gratuit et premium)</li>
            <li>Des box DIY pour anniversaires</li>
            <li>
              Des fichiers numériques téléchargeables (checklists, invitations,
              plannings)
            </li>
            <li>
              Des services associés (générateur IA, carnets d'adresses, gestion
              des invités)
            </li>
            <li>Des produits personnalisés (t-shirts, livres, goodies)</li>
            <li>
              Des mises en relation avec des prestataires (pâtissiers,
              animateurs, clowns, etc.)
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Article 3 - Prix</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Les prix affichés sont en euros (€), toutes taxes comprises (TTC).
            </li>
            <li>
              Ma Fête Facile se réserve le droit de modifier ses prix à tout
              moment.
            </li>
            <li>
              Les abonnements sont proposés avec ou sans engagement selon les
              offres.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Article 4 - Commande et paiement
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Les commandes se font en ligne via le site.</li>
            <li>
              Les moyens de paiement acceptés : carte bancaire, PayPal, autres
              modes selon disponibilité.
            </li>
            <li>
              Le paiement est sécurisé par{" "}
              <strong>[nom du prestataire de paiement]</strong>.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Article 5 - Livraison</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Produits numériques :</strong> téléchargement immédiat
              après paiement.
            </li>
            <li>
              <strong>Produits physiques (box, t-shirts, livres) :</strong>{" "}
              livraison par transporteur partenaire (délai moyen : 3 à 7 jours
              ouvrés).
            </li>
            <li>
              <strong>Prestataires événementiels :</strong> réservation
              confirmée après validation et paiement.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Article 6 - Droit de rétractation
          </h2>
          <p>
            Conformément au Code de la Consommation (art. L221-18), le client
            dispose d'un délai de 14 jours pour exercer son droit de
            rétractation, sauf pour :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Les services numériques déjà consommés</li>
            <li>Les produits personnalisés (non remboursables)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Article 7 - Responsabilité
          </h2>
          <p>
            Ma Fête Facile ne saurait être tenue responsable des dommages
            résultant de l'utilisation du site ou d'une mauvaise exécution par
            un prestataire externe.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Article 8 - Données personnelles
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Les données collectées sont utilisées uniquement dans le cadre des
              services proposés par le site.
            </li>
            <li>
              Le client peut demander la suppression de ses données à tout
              moment.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Article 9 - Loi applicable et litiges
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Les présentes CGV sont régies par le droit français.</li>
            <li>
              En cas de litige, une solution amiable sera recherchée avant toute
              procédure judiciaire.
            </li>
            <li>
              À défaut, le tribunal compétent sera celui du lieu de résidence du
              client.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default TermsConditions;

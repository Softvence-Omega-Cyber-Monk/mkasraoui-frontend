function LegalNotice() {
  return (
    <div>
      <div className="mx-auto max-w-4xl p-6 leading-relaxed text-gray-800">
        <h1 className="mb-6 text-3xl font-bold">
          Mentions légales – Ma Fête Facile
        </h1>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Éditeur du site</h2>
          <p>
            <strong>Ma Fête Facile</strong> <br />
            [Nom du responsable légal ou de la société] <br />
            Adresse : [Adresse du siège social] <br />
            Email :{" "}
            <a href="mailto:contact@mafetefacile.fr" className="text-blue-600">
              contact@mafetefacile.fr
            </a>{" "}
            <br />
            Téléphone : [numéro] <br />
            SIRET : [numéro d'immatriculation] <br />
            Responsable de publication : [Nom]
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Hébergement</h2>
          <p>
            Le site est hébergé par : <br />
            [Nom de l'hébergeur] <br />
            Adresse : [Adresse de l'hébergeur] <br />
            Téléphone : [numéro]
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Propriété intellectuelle
          </h2>
          <p>
            L'ensemble du contenu du site (textes, images, logos, charte
            graphique, etc.) est protégé par le droit d'auteur. Toute
            reproduction, distribution ou utilisation sans autorisation est
            interdite.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">
            Données personnelles (RGPD)
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD - UE 2016/679), vous disposez d'un droit d'accès, de
            rectification, d'opposition et de suppression de vos données
            personnelles.
          </p>
          <p>
            Pour exercer vos droits, contactez : <strong>[email RGPD]</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LegalNotice;

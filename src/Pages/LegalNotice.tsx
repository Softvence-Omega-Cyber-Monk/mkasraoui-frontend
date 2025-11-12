function LegalNotice() {
  return (
    <div>
      <div className="mx-auto max-w-6xl p-6 leading-relaxed text-gray-800">
        <h1 className="mb-6 text-3xl font-bold">
          Mentions légales – Ma Fête Facile
        </h1>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Éditeur du site</h2>
          <p>
            <strong>Ma Fête Facile</strong> <br />{" "}
            <hr className="mb-2 border-[#E5E7EB]" />
            <strong>Adresse :</strong> 43 rue de la Comédie Française, 95220
            Herblay sur Seine
            <br />
            <strong>Email :</strong>
            <a href="mailto:contact@mafetefacile.fr" className="text-blue-600">
              contact@mafetefacile.fr
            </a>
            <br />
            <strong>Téléphone : </strong> 09 82 48 36 84 <br />
            <strong>SIRET :</strong> 94058995500019 <br />
            <strong>Responsable de publication :</strong> Mohamed KASRAOUI
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Hébergement</h2>
          <p>
            <strong>Le site est hébergé par : </strong> Hostinger International
            Ltd.
            <br />
            <strong>Adresse : </strong> 61 Lordou Vironos Street, 6023 Larnaca,
            Chypre
            <br />
            <strong>Téléphone :</strong> +357 24 03 0586
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
            Pour exercer vos droits, contactez :{" "}
            <strong className="text-blue-600">contact@mafetefacile.fr</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LegalNotice;

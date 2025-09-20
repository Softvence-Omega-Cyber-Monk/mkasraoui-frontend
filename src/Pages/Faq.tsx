/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const faqs = [
  {
    question: "1. Qu'est-ce que Ma Fête Facile IA?",
    answer:
      "Ma Fête Facile IA est une plateforme innovante qui utilise l'intelligence artificielle pour aider les parents à organiser des anniversaires d'enfants facilement et rapidement. En quelques clics, vous obtenez un planning clé en main, des idées de décorations, des box DIY adaptées à l'âge de votre enfant, des invitations personnalisées et même une sélection de cadeaux via nos partenaires.",
  },
  {
    question: "2. Comment fonctionne le Générateur de Fête IA ?",
    answer:
      "C'est très simple : Vous renseignez quelques informations (âge, prénom, thème choisi, nombre d'invités, budget). L'IA vous propose automatiquement un planning détaillé, une checklist des achats, des activités adaptées et un PDF téléchargeable. Vous pouvez personnaliser ou modifier les suggestions.",
  },
  {
    question: "3. Dois-je payer pour utiliser Ma Fête Facile IA?",
    answer:
      "Version gratuite : accès au générateur IA de base, checklist et quelques modèles d'invitations.\nVersion premium (2,99 €/mois ou 29 €/an): accès illimité aux fonctionnalités avancées : Templates exclusifs, Invitations personnalisées envoyées automatiquement, Générateur d'activités enrichi, Offres partenaires exclusives, Carnet d'adresses intégré.",
  },
  {
    question: "4. Qu'est-ce que les Box DIY ?",
    answer:
      "Ce sont des kits créatifs prêts à l'emploi, conçus selon l'âge de votre enfant et le thème choisi (pirates, licornes, jungle, superhéros, etc.). Chaque box contient : Le matériel nécessaire pour réaliser 3 à 5 activités manuelles, des tutoriels visuels pas à pas, et une vidéo explicative (premium).",
  },
  {
    question: "5. Comment fonctionnent les invitations ?",
    answer:
      "Vous pouvez générer en quelques secondes des invitations personnalisées (texte + visuel). Deux options : Téléchargement PDF pour impression, ou Envoi direct par email ou SMS via notre plateforme (avec suivi des réponses des invités).",
  },
  {
    question:
      "6. Est-ce que Ma Fête Facile IA propose des prestataires (pâtissiers, animateurs, clowns)?",
    answer:
      "Oui, nous proposons un annuaire de prestataires inscrits sur la plateforme. Vous pouvez filtrer par catégorie, ville et budget, consulter leur fiche (photos, avis clients, tarifs) et réserver directement via notre site.",
  },
  {
    question: "7. Puis-je acheter des cadeaux sur le site ?",
    answer:
      "Nous proposons une sélection de cadeaux par âge grâce à nos partenaires e-shops. L'IA vous suggère les meilleures idées selon le profil de votre enfant. Vous pouvez aussi créer une liste de souhaits à partager avec vos proches.",
  },
  {
    question: "8. Est-ce que je peux annuler mon abonnement ?",
    answer:
      "Oui, l'abonnement premium est sans engagement. Vous pouvez l'arrêter à tout moment depuis votre compte.",
  },
  {
    question:
      "9. Est-ce que Ma Fête Facile IA est disponible partout en France ?",
    answer:
      "Oui, le générateur et les invitations sont accessibles partout. Concernant les prestataires (animateurs, pâtissiers, etc.), la disponibilité dépend de votre région.",
  },
  {
    question: "10. Comment contacter l'équipe Ma Fête Facile IA ?",
    answer:
      "Vous pouvez nous écrire via la page Contact, ou directement par email : support@mafêtefacile.fr. Nous répondons généralement sous 24h ouvrées.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div>
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-center text-3xl font-bold">
          FAQ - Ma Fête Facile IA
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border-2 border-[#223B7D] shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between bg-gray-100 p-4 text-left hover:bg-gray-200 focus:outline-none"
              >
                <span className="font-semibold">{faq.question}</span>
                <span className="ml-2">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="border-t bg-white p-4 whitespace-pre-line text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq;

// BlogDetails.tsx
import { useParams, Navigate } from "react-router-dom";
import bannerImg from "@/assets/new-blog-detailes.png";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import NeverMissPartyTip from "@/components/Never miss party tip/NeverMissPartyTip";

export default function BlogDetails() {
  const { id } = useParams();

  const blog = [
    {
      id: 1,
      title:
        "Ma Fête Facile : l’assistant IA qui organise l’anniversaire parfait pour vos enfants",
      Introduction: "Introduction",
      description:
        "Organiser l’anniversaire de son enfant est toujours un moment de joie… mais aussi un vrai défi. Trouver une idée originale, gérer la liste des invités, prévoir la décoration, choisir les activités, le gâteau, les cadeaux… autant de détails qui peuvent vite devenir une source de stress",
      description1:
        "Et si l’intelligence artificielle pouvait transformer cette mission en une expérience simple, ludique et personnalisée ? C’est exactement ce que propose Ma Fête Facile, le premier assistant IA français dédié aux anniversaires des enfants.",

      boldText: "Une IA au service des parents débordés",
      text1:
        "Ma Fête Facile est bien plus qu’un simple site d’organisation : c’est un assistant intelligent, conçu pour comprendre vos besoins et générer un planning clé en main.",
      text2: "Il vous suffit de renseigner quelques informations :",
      textpoint1: "• L’âge et le prénom de votre enfant",
      textpoint2:
        "• Le thème choisi (licorne, pirate, jungle, super-héros, etc.)",
      textpoint3: "• Le nombre d’invités et la durée de la fête",
      textpoint4: "• Votre budget",
      text3:
        "En quelques secondes, l’IA vous propose un programme personnalisé : idées d’activités adaptées à l’âge, suggestions de décoration, menu festif, playlists, checklists, et même des liens vers des cadeaux et accessoires à acheter..",

      /* Part-2 */

      boldTextPart2: "Des fonctionnalités qui font gagner du temps",
      textPart1:
        "Avec Ma Fête Facile, tout est pensé pour simplifier la vie des parents :.",
      // textPart2: "Il vous suffit de renseigner quelques informations :",
      textPartpoint1:
        " •Générateur de fête IA : un planning complet en un clic.",
      textPartpoint2:
        "•	Invitations personnalisées : cartes design générées automatiquement et envoi groupé par mail ou SMS.",
      textPartpoint3:
        "•	Box DIY créatives : activités manuelles prêtes à l’emploi, classées par âge et thème.",
      textPartpoint4:
        "•	Checklists intelligentes : listes dynamiques que vous pouvez modifier et cocher en temps réel.",

      textPartpoint5:
        "•	Boutique cadeaux : des suggestions adaptées à chaque âge, avec des liens directs vers des partenaires de confiance.",

      textPart3: "",
      /* Part-3 */

      boldTextPart3: "Une expérience unique et personnalisée",
      textPart13:
        "AChaque anniversaire est unique, et c’est pourquoi Ma Fête Facile met l’accent sur la personnalisation. Grâce à l’IA, le site apprend de vos préférences et vous propose des options toujours plus adaptées :",
      // textPart3: "Il vous suffit de renseigner quelques informations :",
      textPartpoint13: " •	Des idées de décoration assorties à votre thème",
      textPartpoint23:
        "•	Des activités qui tiennent compte de l’âge et du nombre d’enfants",
      textPartpoint33:
        "•	Des recommandations de prestataires locaux (pâtissiers, animateurs, magiciens…)",
      textPartpoint43: "",

      textPartpoint53: "",

      textPart33:
        "Résultat : vous gagnez du temps, vous économisez du stress, et vous créez des souvenirs magiques pour vos enfants et vos invités.",
      /* Part-4 */

      boldTextPart4: "Pourquoi choisir Ma Fête Facile ?",
      textPart14: "",
      // textPart3: "Il vous suffit de renseigner quelques informations :",
      textPartpoint14:
        " •	Gain de temps : plus besoin de passer des heures à chercher des idées sur Internet.",
      textPartpoint24:
        "• Budget maîtrisé : l’IA propose des solutions adaptées à vos moyens.",
      textPartpoint34:
        "•	Tout-en-un : organisation, invitations, cadeaux, activités et souvenirs… tout est regroupé sur une seule plateforme.",
      textPartpoint44: "",

      textPartpoint54: "",

      textPart34:
        "Résultat : vous gagnez du temps, vous économisez du stress, et vous créez des souvenirs magiques pour vos enfants et vos invités.",
      /* Part-5 */

      boldTextPart5: "",
      textPart15: "",
      textPartpoint15: "",
      textPartpoint25: "",
      textPartpoint35: "",
      textPartpoint45: "",
      textPartpoint55: "",
      textPart35: "",
      /* Part-6 */
      boldTextPart6: "",
      textPart16: "",
      textPartpoint16: "",
      textPartpoint26: "",
      textPartpoint36: "",
      textPartpoint46: "",
      textPartpoint56: "",
      textPart36: "",

      /* Conclution */

      conclusion: "conclusion ",
      conclusion1:
        "Organiser l’anniversaire parfait n’a jamais été aussi simple. Avec Ma Fête Facile, vous avez à vos côtés un assistant IA spécialisé dans les anniversaires d’enfants, capable de transformer vos envies en une fête inoubliable. ",
      conclusion2:
        "Alors, prêt(e) à vivre une nouvelle expérience d’organisation sans stress ?",
      conclusion3:
        "Découvrez dès maintenant comment Ma Fête Facile peut vous aider à créer des souvenirs magiques pour votre enfant !",

      image: blog1,
    },

    {
      id: 2,
      title:
        "Pourquoi les parents adorent Ma Fête Facile: gain de temps, organisation simplifiée et souvenirs inoubliables",
      Introduction: "Introduction",
      description:
        "Organiser l’anniversaire de son enfant est toujours un moment excitant… mais parfois aussi un véritable casse-tête ! Entre trouver une idée de thème, préparer les invitations, gérer le budget, prévoir les activités et s’assurer que tout soit prêt à temps, les parents se sentent souvent dépassés.",
      description1:
        "C’est pour répondre à ces besoins que Ma Fête Facile a été créée : une solution innovante qui associe intelligence artificielle et inspirations créatives pour transformer chaque anniversaire en une fête magique et parfaitement organisée.",

      boldText: "1.	Un gain de temps considérable",
      text1:
        "La première raison pour laquelle les parents plébiscitent Ma Fête Facile est simple : le temps.",
      text2:
        "En quelques clics seulement, notre générateur de fête IA propose un planning personnalisé selon :",
      textpoint1: "• l’âge de l’enfant,",
      textpoint2: "•	le thème choisi,",
      textpoint3: "•	le budget disponible,",
      textpoint4: "•	le nombre d’invités.",
      text3:
        "Résultat : plus besoin de passer des heures sur Pinterest, Google ou dans les magasins. Tout est réuni et organisé automatiquement, avec la possibilité de télécharger une checklist complète et un PDF prêt à l’emploi.",

      /* Part-2 */

      boldTextPart2: "2.	Une organisation simplifiée à 100 %",
      textPart1:
        "L’autre force de Ma Fête Facile, c’est sa capacité à centraliser tous les outils utiles :",
      // textPart2: "Il vous suffit de renseigner quelques informations :",
      textPartpoint1:
        " •	Invitations personnalisées générées par IA (texte + design) et envoi direct par email ou SMS.",
      textPartpoint2:
        "•	Carnet d’adresses intégré pour gérer les invités et suivre les réponses en temps réel.",
      textPartpoint3:
        "•	Box DIY thématiques livrées à domicile, adaptées à l’âge des enfants.",
      textPartpoint4: "",

      textPartpoint5: "",

      textPart3:
        "Tout est pensé pour que chaque parent puisse dire : “J’ai tout sous contrôle, sans stress.”",
      /* Part-3 */

      boldTextPart3:
        " 3. Des souvenirs inoubliables pour les enfants et les parents",
      textPart13:
        "Une fête réussie, c’est avant tout un moment gravé dans la mémoire. Grâce aux fonctionnalités de Ma Fête Facile :",
      // textPart3: "Il vous suffit de renseigner quelques informations :",
      textPartpoint13:
        "•	Les enfants profitent d’activités adaptées et amusantes (chasse au trésor, ateliers créatifs, jeux en plein air).",
      textPartpoint23:
        "•	Les parents peuvent se concentrer sur l’essentiel : partager des instants précieux avec leur enfant et leurs invités.",
      textPartpoint33:
        "•	Les souvenirs sont immortalisés avec un album photo souvenir et même des livres d’anniversaire premium disponibles sur la boutique du site.",
      textPartpoint43: "",

      textPartpoint53: "",

      textPart33: "",
      /* Part-4 */

      boldTextPart4: "",
      textPart14: "",
      // textPart3: "Il vous suffit de renseigner quelques informations :",
      textPartpoint14: " ",
      textPartpoint24: "",
      textPartpoint34: "",
      textPartpoint44: "",
      textPartpoint54: "",

      textPart34: "",
      /* Part-5 */

      boldTextPart5: "",
      textPart15: "",
      textPartpoint15: "",
      textPartpoint25: "",
      textPartpoint35: "",
      textPartpoint45: "",
      textPartpoint55: "",
      textPart35: "",
      /* Part-6 */
      boldTextPart6: "",
      textPart16: "",
      textPartpoint16: "",
      textPartpoint26: "",
      textPartpoint36: "",
      textPartpoint46: "",
      textPartpoint56: "",
      textPart36: "",

      /* Conclution */

      conclusion: "En résumé ",
      conclusion1:
        "Ma Fête Facile est bien plus qu’un simple site d’organisation : c’est un assistant intelligent qui permet aux parents de transformer l’organisation d’une fête en une expérience agréable, simple et mémorable.",
      conclusion2:
        "Avec Ma Fête Facile, dites adieu au stress et bonjour aux sourires, aux rires et aux souvenirs inoubliables.",
      conclusion3:
        "“Envie de tester gratuitement notre générateur de fête IA ? Cliquez ici et préparez dès maintenant l’anniversaire parfait pour votre enfant !” (bouton raccourci vers le g générateur)",

      image: blog2,
    },
    {
      id: 3,
      title: "Les erreurs à éviter quand on organise une fête d’enfants",
      Introduction: "Introduction",
      description:
        "Organiser une fête d’anniversaire pour un enfant, c’est un moment magique, mais aussi un vrai défi. Entre l’excitation des petits, les attentes des parents, et les imprévus, il est facile de tomber dans certains pièges qui peuvent gâcher la journée. Pas de panique ! Voici les erreurs les plus fréquentes à éviter pour que la fête reste un souvenir inoubliable, sans stress.",
      description1: "",

      boldText: "1. Inviter trop (ou pas assez) d’enfants",
      text1:
        " Trop d’invités = trop de bruit, d’agitation, et parfois des pleurs. ",
      text2: "Pas assez d’invités = l’enfant peut se sentir déçu.",
      textpoint1: "",
      textpoint2: "",
      textpoint3: "",
      textpoint4: "",
      text3:
        "La règle d’or : le nombre d’invités doit correspondre à l’âge de l’enfant (exemple : 6 ans = 6 invités). C’est un bon équilibre entre fête conviviale et ambiance gérable.",

      /* Part-2 */

      boldTextPart2: "2. Choisir un thème trop compliqué",
      textPart1:
        "Les parents veulent parfois en mettre plein la vue avec un thème sophistiqué (Harry Potter version cinéma, décor jungle XXL…). Mais cela demande du temps, un gros budget, et génère du stress.",
      textPart2: "Il vous suffit de renseigner quelques informations :",
      textPartpoint1: " ",
      textPartpoint2: " ",
      textPartpoint3: " ",
      textPartpoint4: ".",

      textPartpoint5: "",

      textPart3:
        "Opte plutôt pour un thème simple et universel (pirates, licornes, super-héros, jungle…) que tu peux adapter avec de la déco DIY ou une box prête à l’emploi.",
      /* Part-3 */

      boldTextPart3: "3. Ne pas prévoir d’activités",
      textPart13:
        "Un des plus grands pièges est de penser que “les enfants vont s’amuser tout seuls”. Résultat : bagarre pour les jouets, ennui, voire crise.",
      textPart23: "Prépare un petit planning d’activités :",
      /*  */
      textPartpoint13:
        " •	1 activité manuelle (DIY, coloriage, bricolage simple)",
      textPartpoint23:
        "•	1 jeu collectif (chasse au trésor, relais, jeu des chaises musicales)",
      textPartpoint33:
        "•	1 moment calme (goûter, histoire, ouverture des cadeaux)",
      textPartpoint43: "",

      textPartpoint53: "",

      textPart33: "",
      /* Part-4 */

      boldTextPart4: "4. Surestimer la durée de la fête",
      textPart14: "Une fête trop longue fatigue les enfants (et les parents).",
      textPart24: "",
      textPartpoint14: " ",
      textPartpoint24: "",
      textPartpoint34: "",
      textPartpoint44: "",

      textPartpoint54: "",

      textPart34:
        "Durée idéale : 2h à 2h30 maximum pour les moins de 8 ans, jusqu’à 3h pour les plus grands.",
      /* Part-5 */

      boldTextPart5: "5. Oublier les allergies et régimes alimentaires",
      textPart15:
        "Un classique : un gâteau aux noisettes alors qu’un enfant est allergique.  Demande toujours aux parents les allergies ou régimes spéciaux à l’avance. Et prévois une alternative simple (exemple : gâteau sans gluten ou bonbons vegan).",
      textPartpoint15: "",
      textPartpoint25: "",
      textPartpoint35: "",
      textPartpoint45: "",
      textPartpoint55: "",
      textPart35: "",
      /* Part-6 */
      boldTextPart6: "6. Ne pas prévoir d’aide",
      textPart16:
        "Gérer 10 enfants seul(e) peut vite tourner au chaos. Prévois au moins un adulte supplémentaire pour encadrer les activités, distribuer le goûter ou calmer les petits bobos ",
      textPartpoint16: "",
      textPartpoint26: "",
      textPartpoint36: "",
      textPartpoint46: "",
      textPartpoint56: "",
      textPart36: "",
      /* Part-7 */
      boldTextPart7: "7. Laisser les cadeaux sans organisation",
      textPart17:
        "Le moment des cadeaux peut vite devenir anarchique : tout le monde parle, les papiers volent, certains enfants se sentent exclus.",
      textPartpoint17: "",
      textPartpoint27: "",
      textPartpoint37: "",
      textPartpoint47: "",
      textPartpoint57: "",
      textPart37:
        "Astuce : installe un “coin cadeaux” et organise un petit rituel où chaque invité donne son cadeau et reçoit un merci personnalisé.",

      /* Conclution */

      conclusion: "conclusion ",
      conclusion1:
        "Organiser une fête d’enfants réussie, ce n’est pas chercher la perfection. C’est surtout savoir anticiper et créer une ambiance joyeuse et adaptée à l’âge des enfants. Avec un peu de préparation (et quelques astuces de Ma Fête Facile), la journée sera magique pour les petits comme pour les grands !",
      conclusion2:
        "“Besoin d’aide pour organiser une fête sans stress ? Découvrez notre Générateur de Fête IA et nos Box DIY sur Ma Fête Facile !”",
      conclusion3: "",

      image: blog3,
    },
    {
      id: 4,
      title: "Comment organiser un anniversaire sans stress en 2025 ?",
      Introduction: "Introduction",
      description:
        "Organiser un anniversaire est un moment excitant… mais qui peut vite devenir source de stress. Entre la liste des invités, le gâteau, les décorations, les activités et les imprévus, on peut se sentir dépassé.",
      description1:
        "Bonne nouvelle : en 2025, il existe des outils et astuces pour transformer la préparation en un vrai jeu d’enfant.",
      description2:
        "Dans cet article, on te partage un guide complet pour organiser une fête simple, joyeuse et inoubliable, sans prise de tête.",

      boldText: "1.	Planifier à l’avance avec les bons outils",
      text1: "La clé d’un anniversaire réussi, c’est l’anticipation.",
      text2: "",
      textpoint1: "•	Fixe la date au moins 1 mois avant.",
      textpoint2:
        "•	Utilise un générateur de fête IA comme celui de Ma Fête Facile : en 3 minutes, tu obtiens un planning clé en main, adapté à l’âge, au thème et au budget.",
      textpoint3:
        "•	Prépare une checklist téléchargeable pour suivre chaque étape (invitations, décoration, repas, jeux, cadeaux).",
      textpoint4: "",
      text3:
        "Astuce : note tout dans ton agenda ou synchronise avec ton calendrier Google pour éviter les oublis.",

      /* Part-2 */

      boldTextPart2: "2.	Choisir un thème qui simplifie tout",
      textPart1: "Un thème bien choisi facilite énormément la préparation :",
      // textPart2: "Il vous suffit de renseigner quelques informations :",
      textPartpoint1:
        "•	Décorations coordonnées (ex : licorne, pirate, jungle, super-héros).",
      textPartpoint2:
        "•	Activités adaptées : chasse au trésor pour les pirates, atelier paillettes pour les licornes…",
      textPartpoint3:
        "•	Cadeaux groupés : tu peux créer une liste de souhaits en ligne pour éviter les doublons.",
      textPartpoint4: "",
      textPartpoint5: " ",

      textPart3:
        "En 2025, l’IA peut même te suggérer des thèmes tendances et générer automatiquement des idées déco ou d’activités.",
      /* Part-3 */

      boldTextPart3: "3.	Gérer les invitations facilement ✉️",
      textPart13: "Oublie les heures passées à écrire à tout le monde !",
      // textPart3: "Il vous suffit de renseigner quelques informations :",
      textPartpoint13:
        "•	Crée ton invitation digitale personnalisée en quelques clics (texte + visuel générés par IA).",
      textPartpoint23:
        "•	Envoie-la directement par email, WhatsApp ou SMS grâce au carnet d’adresses intégré.",
      textPartpoint33:
        "•	Suis en temps réel les réponses des invités et envoie des relances automatiques.",
      textPartpoint43: "",
      textPartpoint53: "",
      textPart33: " Résultat : zéro stress et une communication fluide.",
      /* Part-4 */

      boldTextPart4:
        "4.	Préparer des activités qui occupent vraiment les enfants",
      textPart14: "Rien de pire que des enfants qui s’ennuient !",
      textPart24: "Quelques idées :",
      /* point */
      textPartpoint14:
        " •	1-3 ans : bulles de savon, comptines, tapis sensoriels.",
      textPartpoint24:
        "•	4-6 ans : atelier cuisine, coloriages géants, mini-parcours sportif.",
      textPartpoint34:
        " •	7-9 ans : chasse au trésor, karaoké, atelier créatif.",
      textPartpoint44:
        "•	10-12 ans : escape game maison, quiz interactif, atelier cuisine.",

      textPartpoint54: "",

      textPart34:
        "Avec Ma Fête Facile, tu peux recevoir une box DIY clé en main contenant tout le matériel.",
      /* Part-5 */

      boldTextPart5: "5.	Ne pas tout faire soi-même",
      textPart15: "En 2025, tu peux déléguer :",
      /*  */
      textPartpoint15:
        "•	Pâtissiers partenaires : pour commander ton gâteau directement depuis la plateforme.",
      textPartpoint25:
        "•	Animateurs locaux : magiciens, clowns, DJ pour enfants.",
      textPartpoint35: "•	Livraison de box DIY : gain de temps assuré.",
      textPartpoint45: "",
      textPartpoint55: "",
      textPart35:
        "Résultat : tu profites vraiment de la fête au lieu de courir partout.",
      /* Part-6 */
      boldTextPart6: "6.	Prévoir un plan B pour éviter le stress",
      textPart16: "",
      /* point */
      textPartpoint16:
        "•	Si tu prévois une activité extérieure → garde une version intérieure prête.",
      textPartpoint26:
        "•	Si un invité annule → adapte ton organisation (ex : liste d’activités modulables générée par l’IA).",
      textPartpoint36:
        "•	Avoir un kit de secours (pansements, mouchoirs, bouteilles d’eau) peut sauver la journée !",
      textPartpoint46: "",
      textPartpoint56: "",
      textPart36: "",

      /* Conclution */

      conclusion: "conclusion ",
      conclusion1:
        "Organiser un anniversaire en 2025 ne doit plus être synonyme de stress.Grâce aux outils digitaux, à l’IA et aux solutions prêtes à l’emploi comme Ma Fête Facile, tu peux préparer une fête :",
      conclusion2: "•	personnalisée •	organisée joyeuse •	et sans prise de tête !",
      conclusion3:
        "Alors, prêt(e) à offrir à ton enfant un anniversaire inoubliable… et à toi-même un vrai moment de sérénité ?",

      image: blog4,
    },
    {
      id: 5,
      title:
        "Du gâteau aux cadeaux : le guide complet pour un anniversaire réussi avec Ma Fête Facile",
      Introduction:
        "Du gâteau aux cadeaux : le guide complet pour un anniversaire réussi avec Ma Fête Facile",
      description:
        "Organiser un anniversaire demande de penser à beaucoup de choses : le thème, la décoration, les activités, le gâteau, les cadeaux, les invitations… Sans une bonne préparation, il est facile de se laisser submerger.",
      description1:
        "Avec Ma Fête Facile, vous avez enfin un allié intelligent qui transforme la préparation d’un anniversaire en une expérience fluide, amusante et surtout… réussie !",
      description2:
        "Dans cet article, nous vous guidons étape par étape : du gâteau aux cadeaux, en passant par la décoration et les animations.",

      boldText: "1. Choisir le thème parfait",
      text1:
        " Le thème est le fil conducteur de toute la fête. Il inspire la décoration, le gâteau, les activités et même les invitations.",
      text2: "",
      textpoint1:
        "•	Pour les petits (3-6 ans) : Licorne, Super-héros, Pirates, Jungle.",
      textpoint2:
        "•	Pour les plus grands (7-12 ans) : Harry Potter, Espace, Musique, Jeux vidéo.",
      textpoint3:
        "•	Pour les ados et adultes : Soirée chic & glamour, Black & White, Karaoké, Escape Game maison.",
      textpoint4: "",
      text3:
        " Grâce au Générateur IA de Ma Fête Facile, entrez simplement l’âge, les goûts et le budget : l’IA vous propose instantanément des thèmes adaptés avec une sélection de déco et d’activités.",

      /* Part-2 */

      boldTextPart2: "2.	Le gâteau : la star de la fête",
      textPart1: "Aucun anniversaire n’est complet sans un gâteau inoubliable.",
      // textPart2: "Il vous suffit de renseigner quelques informations :",
      textPartpoint1: " •	Classiques : chocolat, fraise, vanille.",
      textPartpoint2: "•	Créatifs : gâteau licorne, rainbow cake, number cake.",
      textPartpoint3:
        "•	Personnalisés : avec photo imprimée ou figurines préférées de l’enfant.",
      textPartpoint4: "",
      textPartpoint5: "",

      textPart3:
        "Astuce : Si vous n’avez pas le temps de cuisiner, vous pouvez trouver et réserver un pâtissier partenaire directement depuis Ma Fête Facile.",
      /* Part-3 */

      boldTextPart3: "3.	Les cadeaux qui font plaisir",
      textPart13:
        "Trouver le bon cadeau est parfois un défi. Sur Ma Fête Facile, vous pouvez :",
      textPart23: "",
      textPartpoint13: "",
      textPartpoint23: "",
      textPartpoint33: "",
      textPartpoint43: "",

      textPartpoint53: "",

      textPart33:
        "Générer automatiquement une liste de cadeaux selon l’âge et les passions de l’enfant. Accéder à une boutique de partenaires avec des prix négociés. Proposer une liste de souhaits en ligne à partager avec les invités pour éviter les doublons.",
      /* Part-4 */

      boldTextPart4: "4.	Les activités et animations",
      textPart14:
        "C’est ce qui crée les souvenirs ! Quelques idées selon l’âge :",
      // textPart3: "Il vous suffit de renseigner quelques informations :",
      textPartpoint14:
        " •	3-6 ans : Chasse au trésor, atelier coloriage, bulles de savon.",
      textPartpoint24: "•	7-9 ans : Jeux sportifs, mini quiz, atelier cupcakes.",
      textPartpoint34:
        "•	10-12 ans : Escape game maison, karaoké, défis créatifs.",
      textPartpoint44: "",

      textPartpoint54: "",

      textPart34:
        "Avec le Générateur IA, vous obtenez un planning d’activités clé en main, prêt à télécharger en PDF.",
      /* Part-5 */

      boldTextPart5: "✉️ 5. Invitations et organisation des invités",
      textPart15:
        "Fini les groupes WhatsApp désordonnés ! Avec Ma Fête Facile, vous pouvez :",
      /* point */
      textPartpoint15:
        "•	Créer vos invitations personnalisées (texte + visuel générés par IA).",
      textPartpoint25: "•	Envoyer directement par mail ou SMS.",
      textPartpoint35:
        "•	Suivre les réponses des invités et relancer automatiquement.",
      textPartpoint45: "",
      textPartpoint55: "",
      textPart35: "",
      /* Part-6 */
      boldTextPart6: "6.	La checklist ultime",
      textPart16:
        "Rien n’est oublié grâce à notre checklist intelligente : décoration, boissons, animations, musique, gâteau, cadeaux…Vous pouvez l’imprimer, la personnaliser ou la recevoir directement par mail.",
      textPartpoint16: "",
      textPartpoint26: "",
      textPartpoint36: "",
      textPartpoint46: "",
      textPartpoint56: "",
      textPart36: "",

      /* Conclution */

      conclusion: "conclusion ",
      conclusion1:
        "Organiser un anniversaire ne doit pas être source de stress mais de plaisir. Avec Ma Fête Facile, vous avez toutes les clés pour réussir : un assistant IA, des box DIY créatives, une boutique cadeaux intégrée et des outils pratiques pour gérer invités, animations et surprises. ",
      conclusion2:
        "✨ Alors, prêt(e) à transformer chaque anniversaire en un souvenir inoubliable ?",
      conclusion3:
        "Essayez gratuitement Ma Fête Facile dès aujourd’hui et laissez l’IA faire le travail !",

      image: blog5,
    },
    {
      id: 6,
      title:
        "Box DIY, générateur d’idées et cadeaux personnalisés : découvrez tous les services de Ma Fête Facile",
      Introduction: "Introduction",
      description:
        "Préparer un anniversaire, c’est jongler entre plusieurs détails : imaginer un concept qui surprend, soigner l’ambiance avec la bonne déco, prévoir de quoi amuser les invités et choisir le présent qui fera plaisir… Avec Ma Fête Facile, tout devient simple, rapide et surtout amusant ! Grâce à notre plateforme innovante et à notre assistant IA spécialisé dans les fêtes, nous vous aidons à créer un anniversaire inoubliable, adapté à chaque âge et chaque envie.",
      description1: "",

      boldText: "Le générateur d’idées : une fête clé en main grâce à l’IA",
      text1:
        " Vous ne savez pas par où commencer ? Laissez notre générateur intelligent vous guider.",
      text2: "En quelques clics, vous renseignez :",
      /* point */
      textpoint1: "•	l’âge de votre enfant, •	le nombre d’invités,",
      textpoint2:
        "•	le thème choisi (licorne, pirate, jungle, super-héros, etc.), •	et votre budget.",
      textpoint3: "Notre IA prépare ensuite un planning sur mesure avec :",
      textpoint4:
        "•	un déroulé heure par heure, •	des activités adaptées à l’âge des enfants, •	une liste de courses avec liens directs, •	et même des suggestions de cadeaux personnalisés. ",
      text3: " Résultat : une fête organisée sans stress, en un temps record",

      /* Part-2 */

      boldTextPart2: "Les Box DIY : créativité et amusement garantis",
      textPart1:
        "Envie d’ajouter une touche personnelle à votre fête ? Découvrez nos Box DIY (Do It Yourself) ! Chaque box est conçue pour un âge ou un thème spécifique et contient :",
      // textPart2: "Il vous suffit de renseigner quelques informations :",
      textPartpoint1: " •	le matériel nécessaire pour une activité manuelle,",
      textPartpoint2:
        " •	une fiche tutoriel illustrée pas à pas, •	des idées de variantes pour prolonger l’atelier.",
      textPartpoint3: " Par exemple :",
      textPartpoint4:
        "•	Une box “Licorne magique” avec kit de couronnes pailletées.",

      textPartpoint5:
        "•	Une box “Pirates en chasse au trésor” avec coffrets à décorer. •	Une box “Jungle sauvage” avec masques d’animaux à créer.",

      textPart3:
        "C’est l’occasion parfaite de partager un moment créatif avec les enfants tout en rendant la fête unique.",
      /* Part-3 */

      boldTextPart3: " Des cadeaux personnalisés et intelligents",
      textPart13: "•	des t-shirts personnalisés avec le prénom de l’enfant,",
      textPart23:
        "Pour aller encore plus loin, nous proposons des produits exclusifs comme :",

      textPartpoint13: " •	Des idées de décoration assorties à votre thème",
      textPartpoint23: "•	des livres souvenirs d’anniversaire à compléter,",
      textPartpoint33: "•	et bientôt des packs cadeaux sur-mesure.",
      textPartpoint43: "",

      textPartpoint53: "",

      textPart33: "",
      /* Part-4 */

      boldTextPart4: "Invitations et gestion des invités simplifiées",
      textPart14:
        "Avec notre outil en ligne, créez des invitations originales en un clic :",
      // textPart3: "Il vous suffit de renseigner quelques informations :",
      textPartpoint14:
        " modèles personnalisables selon le thème choisi, envoi par email ou SMS, suivi automatique des réponses, relances IA si nécessaire.",
      textPartpoint24: "",
      textPartpoint34: "",
      textPartpoint44: "",

      textPartpoint54: "",

      textPart34:
        "Fini le stress des oublis : tout est centralisé dans votre espace perso.",
      /* Part-5 */

      boldTextPart5: "Pourquoi choisir Ma Fête Facile ?",
      textPart15: "",
      textPartpoint15: "•	Gain de temps et zéro stress.",
      textPartpoint25: "•	Des idées originales grâce à l’IA	",
      textPartpoint35: "• Des box DIY exclusives.",
      textPartpoint45: "•	Un large choix de cadeaux et produits personnalisés.",
      textPartpoint55: "•	Une expérience fluide, du début à la fin.",
      textPart35: "",
      /* Part-6 */
      boldTextPart6: "",
      textPart16: "",
      textPartpoint16: "",
      textPartpoint26: "",
      textPartpoint36: "",
      textPartpoint46: "",
      textPartpoint56: "",
      textPart36: "",

      /* Conclution */

      conclusion: "conclusion ",
      conclusion1:
        "Avec Ma Fête Facile, organiser une fête devient un jeu d’enfant.Testez dès aujourd’hui notre générateur d’idées gratuit et découvrez à quel point une fête peut être simple, unique et inoubliable.",
      conclusion2: "",
      conclusion3: "",

      image: blog6,
    },
  ];

  const findBlog = blog.find((item) => item.id === Number(id));

  if (!findBlog) return <Navigate to="/blog" />;

  return (
    <div>
      {/* Banner */}
      <div
        className="relative mx-auto w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center py-56">
          <h1 className="px-4 text-center text-2xl font-bold text-white md:text-4xl">
            {findBlog.title}
          </h1>
        </div>
      </div>

      {/* Blog Content */}
      <div className="mx-auto mt-20 max-w-4xl px-6 py-6">
        <article className="prose prose-lg max-w-none">
          {/* Introduction */}
          <header className="mb-4">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              {findBlog.Introduction}
            </h2>
          </header>
          <div className="space-y-4">
            <p className="leading-relaxed text-gray-700">
              {findBlog.description}
            </p>
            <p className="leading-relaxed text-gray-700">
              {findBlog.description1}
            </p>
            <p className="leading-relaxed text-gray-700">
              {findBlog.description2}
            </p>
          </div>

          {/* Main Blog Image */}
          <img
            src={findBlog.image}
            alt={findBlog.title}
            className="my-8 h-96 w-full rounded-lg object-cover shadow-md"
          />

          {/* Blog Sections */}
          {[
            {
              bold: findBlog.boldText,
              text: [findBlog.text1, findBlog.text2, findBlog.text3],
              points: [
                findBlog.textpoint1,
                findBlog.textpoint2,
                findBlog.textpoint3,
                findBlog.textpoint4,
              ],
            },
            {
              bold: findBlog.boldTextPart2,
              text: [findBlog.textPart1, findBlog.textPart3],
              points: [
                findBlog.textPartpoint1,
                findBlog.textPartpoint2,
                findBlog.textPartpoint3,
                findBlog.textPartpoint4,
                findBlog.textPartpoint5,
              ],
            },
            {
              bold: findBlog.boldTextPart3,
              text: [findBlog.textPart13, findBlog.textPart33],
              points: [
                findBlog.textPartpoint13,
                findBlog.textPartpoint23,
                findBlog.textPartpoint33,
                findBlog.textPartpoint43,
                findBlog.textPartpoint53,
              ],
            },
            {
              bold: findBlog.boldTextPart4,
              text: [findBlog.textPart14, findBlog.textPart34],
              points: [
                findBlog.textPartpoint14,
                findBlog.textPartpoint24,
                findBlog.textPartpoint34,
                findBlog.textPartpoint44,
                findBlog.textPartpoint54,
              ],
            },
            /* 5 */
            {
              bold: findBlog.boldTextPart5,
              text: [findBlog.textPart15, findBlog.textPart35],
              points: [
                findBlog.textPartpoint15,
                findBlog.textPartpoint25,
                findBlog.textPartpoint35,
                findBlog.textPartpoint45,
                findBlog.textPartpoint55,
              ],
            },
            /* 6 */
            {
              bold: findBlog.boldTextPart6,
              text: [findBlog.textPart16, findBlog.textPart36],
              points: [
                findBlog.textPartpoint16,
                findBlog.textPartpoint26,
                findBlog.textPartpoint36,
                findBlog.textPartpoint46,
                findBlog.textPartpoint56,
              ],
            },
            /* 7 */
            {
              bold: findBlog.boldTextPart7,
              text: [findBlog.textPart17, findBlog.textPart37],
              points: [
                findBlog.textPartpoint17,
                findBlog.textPartpoint27,
                findBlog.textPartpoint37,
                findBlog.textPartpoint47,
                findBlog.textPartpoint57,
              ],
            },
          ].map((section, index) => (
            <div key={index} className="my-8 space-y-3">
              {section.bold && (
                <p className="text-2xl leading-relaxed font-bold text-gray-900">
                  {section.bold}
                </p>
              )}
              {section.text.map(
                (t, idx) =>
                  t && (
                    <p key={idx} className="leading-relaxed text-gray-700">
                      {t}
                    </p>
                  ),
              )}
              <div>
                {section.points.map(
                  (point, idx) =>
                    point && (
                      <p key={idx} className="leading-relaxed text-gray-700">
                        {point}
                      </p>
                    ),
                )}
              </div>
            </div>
          ))}

          {/* Quote Section */}
          <blockquote className="my-8 rounded-r-lg border-l-4 border-black bg-blue-50 py-4 pl-6 italic">
            <p className="leading-relaxed text-gray-800 italic">
              "Aliquam elit mauris rhctu vitiem quam nulla. Gravidas ut gravidas
              ac arco mauris mollis id."
            </p>
          </blockquote>

          {/* Additional Image */}
          <div className="my-12">
            <img
              src={findBlog.image}
              alt={findBlog.title}
              className="h-96 w-full rounded-lg object-cover shadow-md"
            />
            <p className="mt-3 text-left text-sm text-gray-500 italic">
              Image caption goes here
            </p>
          </div>

          {/* Conclusion */}
          <div className="mt-16">
            <h2 className="mb-6 border-b-2 border-gray-200 pb-3 text-3xl font-bold text-gray-900">
              {findBlog.conclusion}
            </h2>
            <div className="space-y-5 leading-relaxed text-gray-700">
              {[
                findBlog.conclusion1,
                findBlog.conclusion2,
                findBlog.conclusion3,
              ].map((c, idx) => (
                <p key={idx}>{c}</p>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Never Miss Party Tip */}
      <NeverMissPartyTip />
    </div>
  );
}

// import { useParams } from "react-router-dom";
// import bannerImg from "@/assets/new-blog-detailes.png";
// import blog1 from "@/assets/blog-1.jpg";
// import blog2 from "@/assets/blog-2.jpg";
// import blog3 from "@/assets/blog-3.jpg";
// import blog4 from "@/assets/blog-4.jpg";
// import blog5 from "@/assets/blog-5.jpg";
// import blog6 from "@/assets/blog-6.jpg";
// import NeverMissPartyTip from "@/components/Never miss party tip/NeverMissPartyTip";
// // import userCicler from "@/assets/profile-circle.png";

// export default function BlogDetails() {
//   const { id } = useParams(); // id is a string
//   console.log("Article ID:", id);

//  const blog = [
//     {
//       id: 1,
//       title: "10 Amazing Superhero Party Ideas That Will Save the Day",
//       description:
//         "Transform your child's birthday into an epic superhero adventure with these creative ideas, from DIY costumes to action-packed games.",
//       image: blog1,
//       author: "Sarah Johnson",
//       readTime: "8 min read",
//       tags: ["DIY", "Decorations", "Games"],
//       category: "Superhero",
//     },
//     {
//       id: 2,
//       title: "Princess Party Planning: Creating a Magical Kingdom",
//       description:
//         "Everything you need to know about hosting the perfect princess party, from royal decorations to enchanting activities.",
//       image: blog2,
//       author: "Emma Wilson",
//       readTime: "6 min read",
//       tags: ["Decorations", "Crafts", "Planning"],
//       category: "Princess",
//     },
//     {
//       id: 3,
//       title: "Dinosaur Party Ideas: Prehistoric Fun for Modern Kids",
//       description:
//         "Dig into these fantastic dinosaur party ideas that will make your celebration roar with excitement and prehistoric fun.",
//       image: blog3,
//       author: "Sarah Johnson",
//       readTime: "8 min read",
//       tags: ["DIY", "Decorations", "Games"],
//       category: "Dinosaur",
//     },
//     {
//       id: 4,
//       title: "Space Party Ideas: Blast Off to Birthday Fun",
//       description:
//         "Transform your child's birthday into an epic superhero adventure with these creative ideas, from DIY costumes to action-packed games.",
//       image: blog4,
//       author: "Sarah Johnson",
//       readTime: "8 min read",
//       tags: ["DIY", "Decorations", "Games"],
//       category: "Space",
//     },
//     {
//       id: 5,
//       title: "Budget-Friendly Party Planning: Amazing Parties Under $100",
//       description:
//         "Everything you need to know about hosting the perfect princess party, from royal decorations to enchanting activities.",
//       image: blog5,
//       author: "Emma Wilson",
//       readTime: "6 min read",
//       tags: ["Decorations", "Crafts", "Planning"],
//       category: "Budget",
//     },
//     {
//       id: 6,
//       title: "Box DIY, générateur d’idées et cadeaux personnalisés : découvrez tous les services de Ma Fête Facile",
//       description:
//         "Dig into these fantastic dinosaur party ideas that will make your celebration roar with excitement and prehistoric fun.",
//       image: blog6,
//       author: "Sarah Johnson",
//       readTime: "8 min read",
//       tags: ["DIY", "Decorations", "Games"],
//       category: "Unicorn",
//     },
//   ];

// const findBlog = blog.find((item) => item.id === Number(id));
// console.log(findBlog);

//   return (
//     <div>
//       <div className="relative w-full  mx-auto bg-cover bg-center"
//       style={{
//         backgroundImage: `url(${bannerImg})`
//       }}
//       >

//         {/* Black Overlay */}
//         <div className="bg-opacity-50 absolute inset-0 bg-black/50"></div>

//         {/* Text Content */}
//         <div className="relative z-10 py-56 flex items-center justify-center">
//           <h1 className="text-center text-2xl font-bold text-white md:text-4xl px-4">
//             {findBlog?.title}
//           </h1>
//         </div>
//       </div>
//       {/* intro text start here  */}
//       <div className=" mt-20">

//         <div className="max-w-4xl mx-auto px-6 py-6">
//         <article className="prose prose-lg max-w-none">
//           {/* Header */}
//           <header className="mb-4">
//             <h1 className="text-4xl font-bold text-gray-900 mb-8  ">
//               Introduction
//             </h1>
//           </header>

//           {/* Main Content */}
//           <div className="space-y-8">
//             <p className="text-gray-700 leading-relaxed">
//               In consequat elit vel tempor lacus ut lorem ipsum. Vestibulum suscipit nulla bibendum facilisis aliquam
//               ipsum. Mauris blandit luctus mauris, et ut. Nulla aliquet lorem velit, nam. Mauris potenti vulputate erat
//               amet lorem in velit. Vestibulum ut mauris mauris a mauris. Dolor elit erat mauris turpis, at pellentesque et amet eu nec.
//             </p>

//             <p className="text-gray-700 leading-relaxed">
//               Cursus quis turpis tristique pulvinar. Aliquam ac. Eget in vulputate rhodo ac vulputate lorem vitae sed molestie
//               vulputate. Vulputate sed lorem ipsum convallis, dolor eu mauris donec ac. Suscipit bibendum nunc, at lorem. In
//               mauris velit et suspendisse, ipsum molestie aliquam donec aliquet ut vel vulputate.
//             </p>

//             {/* Image Section */}
//             <div className="my-12">
//               <div className="relative h-96 w-auto ">
//                 <img
//                   src={findBlog?.image}
//                   alt="Children celebrating with party decorations"
//                   className="w-full h-full  object-cover rounded-lg shadow-md"
//                 />
//               </div>
//               <p className="text-sm text-gray-500 mt-3 italic text-left">
//                 Image caption goes here
//               </p>
//             </div>

//             <p className="text-black font-bold leading-relaxed">
//               Dolor amet eu lorem ante sed felis nulla. Aliquam vestibulum, nulla odio elit nitor. In
//               aliquot pellentesque annean nunc vestibulum tempus in ut bibendum diam. Rhoncus
//               integer aliquam ut vitae molestudae tristique. felis nulla. Aliquam vestibulum.
//             </p>

//             <p className="text-gray-700 leading-relaxed">
//               Lorem ipsum dolor sed nulla facilisis ut eius velit congue mollis semper convallis convallis mau. Sed
//               felis ut ipsum a volutpat phasellus ut leo velit. Donec leo, urna tempor ut posuere
//               lorem blandit vestibus neque porta ut congue sceleris volutpat. Aliquot magna et feugiat cursus gravida
//               lorem. Sed aliquam dolor sed magna mauris. Bibendum in tae. Sed eget mauris
//               lorem sed aliquam mauris ut neque, mauris amet quam velit sem, tempus velit eget lorem ut.
//             </p>

//             {/* Quote Section */}
//             <blockquote className="border-l-4 borderblack  italic pl-6 py-4 my-8 text-[#000000] bg-blue-50 rounded-r-lg">
//               <p className="text-gray-800 italic leading-relaxed">
//                 "Aliquam elit mauris rhctu vitiem quam nulla. Gravidas ut gravidas ac arco mauris mollis id. Nam
//                 pellentesque congue eget consectetur tempor. Sapien, viverra mauris amet mauris mollis
//                 aliquam. Rhon velit vitae, ullamcoper pellaque tempor."
//               </p>
//             </blockquote>

//             <p className="text-gray-700 leading-relaxed">
//               Tempus nulla demenat velit potenti cursus leo metus, viverra. Blandit dui ultrices vulputate mauris
//               eugas nec alique et. Aliquam feugaceper quam. A cursus, nascent lectum sagittis dolor et mauris mauris.
//               Consectetur nulla justo quis vitae posuere turpis. Aliquam vitae ut amet sagittis interdum dolor eu turpis
//               vestibulum.
//             </p>

//             {/* Conclusion Section */}
//             <div className="mt-16">
//               <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-3">
//                 Conclusion
//               </h2>

//               <div className="space-y-6">
//                 <p className="text-gray-700 leading-relaxed">
//                   Mauris gravida mauris augure tellus gravida et tellentibus elit ut taciturn. Ullam id molestique est ulttam libero. Amet et
//                   congue urna lorem ut eget gravida. Suscipit imperia consequent justo velit, etiam ut vestibulum ante metus
//                   porta bibendum.
//                 </p>

//                 <p className="text-gray-700 leading-relaxed">
//                   Mauris ut lacinia blanquet tellentibus ut eius alique nulla phasellus amet gravida sed magna. Ut tristique
//                   bibendum convallis velit eget lacinia mauris. Eget sapien ut lorem velit ut. Quam blandit id ut vel congue
//                   velit mauris tempetus cursus.
//                 </p>

//                 <p className="text-gray-700 leading-relaxed">
//                   Lorem ipsum dolor et lorem ut velit mauris lorem alique. Nam ulla mauris turpis vel posuere velit
//                   diam lorem. Cursus et mauris eget quam. Aliquam auiseuele mauris et ut eget consectetur aliquir. Donec
//                   dolor amet sed cursus elit consequat amet et eu dui verum tellus alique eu quis. Mauris et blandit
//                   pellentesque elit lacinia turpis lorem tempor.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </article>
//       </div>
//       </div>
//       {/* intro text end here  */}
//       {/* never miss trip start here  */}
//       <div className="">

//         <NeverMissPartyTip/>
//       </div>
//       {/* never miss trip end here */}
//     </div>
//   );
// }

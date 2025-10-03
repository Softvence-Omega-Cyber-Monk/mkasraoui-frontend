import { useParams } from "react-router-dom";
import bannerImg from "@/assets/new-blog-detailes.png";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import NeverMissPartyTip from "@/components/Never miss party tip/NeverMissPartyTip";

// Blog details array
const blogDetailsData = [
  {
    id: 1,
    title:
      "Ma Fête Facile : l’assistant IA qui organise l’anniversaire parfait pour vos enfants",
    image: "blog-1.jpg",
    intro:
      "Organiser l’anniversaire de son enfant est toujours un moment de joie… mais aussi un vrai défi. Et si l’IA pouvait transformer cette mission en une expérience simple, ludique et personnalisée ?",
    sections: [
      {
        heading: "Une IA au service des parents débordés",
        points: [
          "L’âge et le prénom de votre enfant",
          "Le thème choisi (licorne, pirate, jungle, super-héros, etc.)",
          "Le nombre d’invités et la durée de la fête",
          "Votre budget",
        ],
        text: "En quelques secondes, l’IA vous propose un programme personnalisé : activités adaptées à l’âge, suggestions de déco, playlists, checklists, et même des liens pour acheter cadeaux et accessoires.",
      },
      {
        heading: "Des fonctionnalités qui font gagner du temps",
        list: [
          "🎉 Générateur de fête IA : planning complet en un clic",
          "💌 Invitations personnalisées et envoi par mail ou SMS",
          "🎨 Box DIY créatives adaptées à chaque âge et thème",
          "✅ Checklists intelligentes et dynamiques",
          "🎁 Boutique cadeaux partenaires avec suggestions adaptées",
        ],
      },
      {
        heading: "Une expérience unique et personnalisée",
        text: "Chaque anniversaire est unique : déco assortie au thème, activités adaptées à l’âge et recommandations de prestataires locaux (pâtissiers, animateurs, magiciens…).",
      },
    ],
    conclusion:
      "Avec Ma Fête Facile, vous gagnez du temps, économisez du stress et créez des souvenirs magiques pour vos enfants.",
  },
  {
    id: 2,
    title:
      "Pourquoi les parents adorent Ma Fête Facile: gain de temps, organisation simplifiée et souvenirs inoubliables",
    image: "blog-2.jpg",
    intro:
      "Organiser l’anniversaire de son enfant peut vite tourner au casse-tête. Ma Fête Facile apporte une solution simple et magique grâce à l’IA.",
    sections: [
      {
        heading: "1. Un gain de temps considérable",
        text: "Notre générateur IA crée un planning personnalisé (âge, thème, budget, invités) en quelques clics. Plus besoin de passer des heures à chercher sur Google ou Pinterest.",
      },
      {
        heading: "2. Une organisation simplifiée à 100 %",
        list: [
          "Invitations design générées par IA et envoyées directement",
          "Carnet d’adresses intégré pour gérer les invités",
          "Box DIY thématiques livrées à domicile",
          "Checklist synchronisable avec le calendrier",
        ],
      },
      {
        heading: "3. Des souvenirs inoubliables",
        text: "Les enfants profitent d’activités amusantes, les parents se concentrent sur l’essentiel, et les souvenirs sont immortalisés grâce à des albums photos et livres premium.",
      },
    ],
    conclusion:
      "Avec Ma Fête Facile, dites adieu au stress et bonjour aux sourires, rires et souvenirs inoubliables.",
  },
  {
    id: 3,
    title: "Les erreurs à éviter quand on organise une fête d’enfants",
    image: "blog-3.jpg",
    intro:
      "Entre l’excitation des petits, les attentes des parents et les imprévus, organiser une fête d’enfants n’est pas toujours simple. Voici les erreurs à éviter.",
    sections: [
      {
        heading: "Inviter trop (ou pas assez) d’enfants",
        text: "Règle d’or : âge de l’enfant = nombre d’invités.",
      },
      {
        heading: "Choisir un thème trop compliqué",
        text: "Mieux vaut un thème simple (pirates, licornes, jungle) adaptable avec DIY ou box.",
      },
      {
        heading: "Ne pas prévoir d’activités",
        text: "Prévoir activité manuelle, jeu collectif et moment calme.",
      },
      {
        heading: "Surestimer la durée",
        text: "2h à 2h30 max pour les petits, 3h max pour les grands.",
      },
      {
        heading: "Oublier allergies/régimes spéciaux",
        text: "Toujours demander à l’avance et prévoir une alternative.",
      },
      {
        heading: "Ne pas prévoir d’aide",
        text: "Toujours avoir un adulte supplémentaire.",
      },
      {
        heading: "Laisser les cadeaux sans organisation",
        text: "Créer un coin cadeaux et un rituel de remerciement.",
      },
    ],
    conclusion:
      "Anticiper et simplifier = une fête réussie. Pas besoin de perfection, juste une ambiance joyeuse et adaptée.",
  },
  {
    id: 4,
    title: "Comment organiser un anniversaire sans stress en 2025 ?",
    image: "blog-4.jpg",
    intro:
      "Avec les bons outils, organiser un anniversaire en 2025 devient un jeu d’enfant. Voici un guide simple pour une fête sans stress.",
    sections: [
      {
        heading: "Planifier à l’avance",
        list: [
          "Fixer la date au moins 1 mois avant",
          "Utiliser un générateur IA",
          "Préparer une checklist synchronisée",
        ],
      },
      {
        heading: "Choisir un thème qui simplifie tout",
        text: "Un thème bien choisi coordonne déco, activités et cadeaux.",
      },
      {
        heading: "Gérer les invitations",
        text: "Invitations digitales IA, envoi WhatsApp/SMS et suivi des réponses.",
      },
      {
        heading: "Préparer des activités adaptées",
        text: "Activités par tranche d’âge + box DIY clé en main.",
      },
      {
        heading: "Ne pas tout faire soi-même",
        text: "Déléguer au pâtissier, animateur ou box prête à l’emploi.",
      },
      {
        heading: "Prévoir un plan B",
        text: "Activités alternatives, kit secours, solutions modulables IA.",
      },
    ],
    conclusion:
      "En 2025, grâce à Ma Fête Facile et l’IA, organiser un anniversaire = sérénité + souvenirs joyeux.",
  },
  {
    id: 5,
    title:
      "Du gâteau aux cadeaux : le guide complet pour un anniversaire réussi avec Ma Fête Facile",
    image: "blog-5.jpg",
    intro:
      "De la déco au gâteau en passant par les activités et les cadeaux, chaque détail compte pour un anniversaire réussi.",
    sections: [
      {
        heading: "Choisir le thème parfait",
        text: "L’IA propose des thèmes adaptés selon âge, goûts et budget.",
      },
      {
        heading: "Le gâteau : la star de la fête",
        text: "Choix entre classiques, créatifs et personnalisés avec option commande chez un pâtissier partenaire.",
      },
      {
        heading: "Les cadeaux",
        text: "IA génère une liste adaptée avec boutique partenaires et liste de souhaits en ligne.",
      },
      {
        heading: "Les activités",
        text: "Jeux, ateliers et animations avec planning clé en main téléchargeable en PDF.",
      },
      {
        heading: "Invitations et invités",
        text: "Invitations IA + suivi automatique des réponses.",
      },
      {
        heading: "La checklist ultime",
        text: "Checklist intelligente couvrant déco, repas, musique, cadeaux.",
      },
    ],
    conclusion:
      "Avec Ma Fête Facile, organiser une fête devient plaisir et non source de stress.",
  },
  {
    id: 6,
    title:
      "Box DIY, générateur d’idées et cadeaux personnalisés : découvrez tous les services de Ma Fête Facile",
    image: "blog-6.jpg",
    intro:
      "Avec Ma Fête Facile, chaque détail d’un anniversaire est pensé pour être simple, créatif et unique.",
    sections: [
      {
        heading: "Le générateur d’idées",
        text: "Planning sur mesure avec activités, liste de courses, suggestions cadeaux.",
      },
      {
        heading: "Les Box DIY",
        text: "Box thématiques (licorne, pirate, jungle…) avec matériel, tutoriel et variantes.",
      },
      {
        heading: "Les cadeaux personnalisés",
        text: "Sélection IA + produits exclusifs : t-shirts, livres souvenirs, packs cadeaux.",
      },
      {
        heading: "Invitations et gestion des invités",
        text: "Modèles IA personnalisables + suivi réponses + relances automatiques.",
      },
    ],
    conclusion:
      "Avec ses outils IA, box DIY et cadeaux personnalisés, Ma Fête Facile rend chaque anniversaire unique et inoubliable.",
  },
];

// Map image filenames to actual imports
const images: Record<string, string> = {
  "blog-1.jpg": blog1,
  "blog-2.jpg": blog2,
  "blog-3.jpg": blog3,
  "blog-4.jpg": blog4,
  "blog-5.jpg": blog5,
  "blog-6.jpg": blog6,
};

export default function BlogDetails() {
  const { id } = useParams();
  const blog = blogDetailsData.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <div className="py-20 text-center text-xl text-gray-600">
        Blog not found.
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div
        className="relative mx-auto w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="bg-opacity-50 absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center py-56">
          <h1 className="px-4 text-center text-2xl font-bold text-white md:text-4xl">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Blog Content */}
      <div className="mt-20">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <article className="prose prose-lg max-w-none">
            {/* Intro */}
            <header className="mb-6">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Introduction
              </h2>
              <p className="leading-relaxed text-gray-700">{blog.intro}</p>
            </header>

            {/* Image */}
            <div className="my-10">
              <img
                src={images[blog.image]}
                alt={blog.title}
                className="h-96 w-full rounded-lg object-cover shadow-md"
              />
              <p className="mt-2 text-sm text-gray-500 italic">
                Illustration for: {blog.title}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {blog.sections.map((section, idx) => (
                <section key={idx}>
                  <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                    {section.heading}
                  </h3>

                  {section.text && (
                    <p className="mb-4 leading-relaxed text-gray-700">
                      {section.text}
                    </p>
                  )}

                  {section.points && (
                    <ul className="list-disc space-y-1 pl-6 text-gray-700">
                      {section.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}

                  {section.list && (
                    <ul className="list-none space-y-2 pl-0">
                      {section.list.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <span className="text-blue-600">✔</span> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Conclusion */}
            <div className="mt-16">
              <h2 className="mb-6 border-b pb-2 text-3xl font-bold text-gray-900">
                Conclusion
              </h2>
              <p className="leading-relaxed text-gray-700">{blog.conclusion}</p>
            </div>
          </article>
        </div>
      </div>

      {/* Never Miss Party Tip */}
      <div className="mt-16">
        <NeverMissPartyTip />
      </div>
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

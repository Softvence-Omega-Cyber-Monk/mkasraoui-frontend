import backgroundImage from "@/assets/bgdoodle.png";
import split from "@/assets/split.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import { AIGenerator, BoxIcon, CheckIcon, LetterIcon } from "../Icons";

gsap.registerPlugin(ScrollTrigger);

export default function WhatWeOffer() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", // Animation starts when the top of the section hits 80% of the viewport
          toggleActions: "play none none none",
        },
        defaults: { duration: 0.8, ease: "power3.out" },
      });

      // Animate the "What we offer" header and split line
      tl.from(".offer-header", { opacity: 0, y: 20, duration: 0.6 })
        .from(
          ".offer-split",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "power2.out",
          },
          "<0.2", // start this animation slightly after the previous one
        )
        // Animate the main title
        .from(
          ".offer-title",
          { opacity: 0, y: 30, duration: 1, ease: "power4.out" },
          "<0.3",
        )
        // Animate the description
        .from(".offer-desc", { opacity: 0, y: 20, duration: 0.8 }, "<0.3")
        // Staggered animation for the feature cards
        .from(
          ".offer-card",
          {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
          },
          "<0.5",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const offerItems = [
    {
      icon: <AIGenerator />,
      title: "AI Generator",
      desc: "Get personalized party plans in minutes with our smart AI assistant",
    },
    {
      icon: <BoxIcon />,
      title: "DIY Party Boxes",
      desc: "Curated boxes with everything you need for the perfect themed party",
    },
    {
      icon: <LetterIcon />,
      title: "Smart Invitations",
      desc: "Create beautiful invitations and track RSVPs effortlessly",
    },
    {
      icon: <CheckIcon />,
      title: "Party Checklist",
      desc: "Never forget anything with our intelligent party planning checklist",
    },
  ];

  return (
    <div
      id="services"
      ref={sectionRef}
      className="container mx-auto mt-10 px-4 py-10 sm:py-16 md:mt-16 md:py-24 lg:px-5"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-6xl text-center">
        {/* Header */}
        <div className="offer-header mb-8 flex flex-col items-center justify-center sm:flex-row sm:gap-2">
          <span className="text-primary text-xl font-medium sm:text-2xl">
            What we offer
          </span>
          <div className="offer-split relative mt-2 w-10 sm:-top-6 sm:left-8 sm:mt-0">
            <img src={split} alt="split line" className="mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Title */}
        <h2 className="offer-title font-fredoka mb-4 text-2xl leading-snug font-semibold text-[#191919] sm:mb-6 sm:text-4xl sm:leading-tight md:text-5xl md:font-bold">
          Everything you need for the
          <br className="hidden sm:block" /> perfect party
        </h2>

        {/* Description */}
        <p className="offer-desc mx-auto mb-10 max-w-xl px-2 text-sm text-[#5A5C5F] sm:mb-16 sm:px-0 sm:text-base md:text-lg">
          From AI-powered planning to curated DIY boxes, we've got every detail
          covered
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 px-1 sm:grid-cols-2 sm:gap-6 sm:px-0 md:gap-8">
          {offerItems.map((item, idx) => (
            <div
              key={idx}
              className="offer-card rounded-2xl bg-[#F6F6F6]/50 p-5 text-center sm:p-6 md:p-8"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl sm:mb-6 md:h-16 md:w-16">
                {item.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800 sm:mb-3 md:text-2xl">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// import backgroundImage from "@/assets/bgdoodle.png";
// import split from "@/assets/split.png";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useLayoutEffect, useRef } from "react";
// import { AIGenerator, BoxIcon, CheckIcon, LetterIcon } from "../Icons";

// gsap.registerPlugin(ScrollTrigger);

// export default function WhatWeOffer() {
//   const sectionRef = useRef(null);

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 80%", // Animation starts when the top of the section hits 80% of the viewport
//           toggleActions: "play none none none",
//         },
//         defaults: { duration: 0.8, ease: "power3.out" },
//       });

//       // Animate the "What we offer" header and split line
//       tl.from(".offer-header", { opacity: 0, y: 20, duration: 0.6 })
//         .from(
//           ".offer-split",
//           {
//             scaleX: 0,
//             transformOrigin: "left center",
//             duration: 0.8,
//             ease: "power2.out",
//           },
//           "<0.2", // start this animation slightly after the previous one
//         )
//         // Animate the main title
//         .from(
//           ".offer-title",
//           { opacity: 0, y: 30, duration: 1, ease: "power4.out" },
//           "<0.3",
//         )
//         // Animate the description
//         .from(".offer-desc", { opacity: 0, y: 20, duration: 0.8 }, "<0.3")
//         // Staggered animation for the feature cards
//         .from(
//           ".offer-card",
//           {
//             opacity: 0,
//             y: 30,
//             stagger: 0.2, // This is the key for the staggered effect
//             duration: 0.8,
//             ease: "power2.out",
//           },
//           "<0.5",
//         ); // start the cards after the description animation has progressed
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   const offerItems = [
//     {
//       icon: <AIGenerator />,
//       title: "AI Generator",
//       desc: "Get personalized party plans in minutes with our smart AI assistant",
//     },
//     {
//       icon: <BoxIcon />,
//       title: "DIY Party Boxes",
//       desc: "Curated boxes with everything you need for the perfect themed party",
//     },
//     {
//       icon: <LetterIcon />,
//       title: "Smart Invitations",
//       desc: "Create beautiful invitations and track RSVPs effortlessly",
//     },
//     {
//       icon: <CheckIcon />,
//       title: "Party Checklist",
//       desc: "Never forget anything with our intelligent party planning checklist",
//     },
//   ];

//   return (
//     <div
//       id="services"
//       ref={sectionRef}
//       className="container mx-auto mt-10 px-4 py-10 sm:py-16 md:mt-16 md:py-24 lg:px-5"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: "contain",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       <div className="mx-auto max-w-6xl text-center">
//         {/* Header */}
//         <div className="offer-header mb-8 flex flex-col items-center justify-center sm:flex-row sm:gap-2">
//           <span className="text-primary text-xl font-medium sm:text-2xl">
//             What we offer
//           </span>
//           <div className="offer-split relative mt-2 w-10 sm:-top-6 sm:left-8 sm:mt-0">
//             <img src={split} alt="split line" className="mx-auto sm:mx-0" />
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="offer-title font-fredoka mb-4 text-2xl leading-snug font-semibold text-[#191919] sm:mb-6 sm:text-4xl sm:leading-tight md:text-5xl md:font-bold">
//           Everything you need for the
//           <br className="hidden sm:block" /> perfect party
//         </h2>

//         {/* Description */}
//         <p className="offer-desc mx-auto mb-10 max-w-xl px-2 text-sm text-[#5A5C5F] sm:mb-16 sm:px-0 sm:text-base md:text-lg">
//           From AI-powered planning to curated DIY boxes, we've got every detail
//           covered
//         </p>

//         {/* Grid */}
//         <div className="grid grid-cols-1 gap-4 px-1 sm:grid-cols-2 sm:gap-6 sm:px-0 md:gap-8">
//           {offerItems.map((item, idx) => (
//             <div
//               key={idx}
//               className="offer-card rounded-2xl bg-[#F6F6F6]/50 p-5 text-center sm:p-6 md:p-8"
//             >
//               <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl sm:mb-6 md:h-16 md:w-16">
//                 {item.icon}
//               </div>
//               <h3 className="mb-2 text-lg font-bold text-gray-800 sm:mb-3 md:text-2xl">
//                 {item.title}
//               </h3>
//               <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
//                 {item.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

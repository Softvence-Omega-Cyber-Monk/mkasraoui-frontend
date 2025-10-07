import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef, useState } from "react";
import { EdgeWave } from "../Icons";
import { useSubscribeNewsletterMutation } from "@/redux/features/newsLetter/newsLetterApi";
import Swal from "sweetalert2";

gsap.registerPlugin(ScrollTrigger);

const NeverMissPartyTip: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [subscribeNewsletter] = useSubscribeNewsletterMutation();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { duration: 0.8, ease: "power3.out" },
      });

      tl.from(".banner-overlay", { opacity: 0, duration: 1.2 })
        .from(".banner-wave-top", { y: -50, opacity: 0, duration: 1 }, "<0.2")
        .from(".banner-headline", { opacity: 0, y: 40, duration: 1.2 }, "<0.3")
        .from(".banner-paragraph", { opacity: 0, y: 20, duration: 1 }, "<0.3")
        .to(
          buttonRefs.current,
          {
            opacity: 1,
            scale: 1,
            stagger: 0.2,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          "<0.4"
        )
        .from(".banner-wave-bottom", { y: 50, opacity: 0, duration: 1 }, "<0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // email validation
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return setEmailError("Email is required");
    }
    if (!validateEmail(email)) {
      return setEmailError("Please enter a valid email address");
    }

    try {
      const res: any = await subscribeNewsletter({ email }).unwrap();
      Swal.fire({
        title: "Subscribed!",
        text: res.message || `You’ll be notified at ${email}.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      setEmail("");
      setEmailError("");
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to subscribe",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div ref={sectionRef} className="mx-auto mt-16 w-full overflow-x-hidden">
      <section className="relative bg-[#BBDEFB]">
        {/* Top wave */}
        <div className="banner-wave-top absolute top-0 left-1/2 z-10 -translate-x-1/2 overflow-hidden leading-none">
          <EdgeWave />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-black sm:py-28 md:py-36 lg:py-40">
          <h1 className="banner-headline font-fredoka max-w-2xl text-2xl font-semibold leading-snug sm:text-4xl md:text-5xl">
            Never miss a party tip!
          </h1>

          <p className="banner-paragraph mt-4 text-sm sm:text-base">
            Subscribe to our newsletter for the latest party planning ideas and
            exclusive content
          </p>

          {/* Form */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-4 flex max-w-md flex-col gap-4 md:flex-row"
            >
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className={`ring-secondary min-w-0 flex-auto rounded-lg border-1 border-black bg-transparent px-3.5 py-3 text-black shadow-sm ring-1 outline-0 ring-inset focus:ring-2 sm:text-sm sm:leading-6 md:min-w-md ${
                  emailError ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="Enter your email"
              />

              <button
                type="submit"
                ref={(el) => buttonRefs.current.push(el)}
                className="hover:bg-secondary-light flex-none cursor-pointer rounded-md bg-[#223B7D] px-4 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Notify me
              </button>
            </form>
          </div>

          {/* error message */}
          {emailError && (
            <p className="mt-2 text-sm text-red-500">{emailError}</p>
          )}

          <p className="mt-4 text-xs">
            Join 10,000+ parents who love our tips! ✨
          </p>
        </div>

        {/* Bottom wave */}
        <div className="banner-wave-bottom absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180 overflow-hidden leading-none">
          <EdgeWave />
        </div>
      </section>
    </div>
  );
};

export default NeverMissPartyTip;


// // import bgImage from "@/assets/videobanner.png";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import React, { useLayoutEffect, useRef, useState } from "react";
// import { EdgeWave } from "../Icons";

// gsap.registerPlugin(ScrollTrigger);

// const NeverMissPartyTip: React.FC = () => {
//   const sectionRef = useRef<HTMLDivElement | null>(null);
//   const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);


//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 80%",
//           toggleActions: "play none none none",
//         },
//         defaults: { duration: 0.8, ease: "power3.out" },
//       });

//       tl.from(".banner-overlay", { opacity: 0, duration: 1.2 })
//         .from(
//           ".banner-wave-top",
//           { y: -50, opacity: 0, duration: 1, ease: "power2.out" },
//           "<0.2",
//         )
//         .from(
//           ".banner-headline",
//           { opacity: 0, y: 40, duration: 1.2, ease: "power4.out" },
//           "<0.3",
//         )
//         .from(".banner-paragraph", { opacity: 0, y: 20, duration: 1 }, "<0.3")
//         .to(
//           buttonRefs.current,
//           {
//             opacity: 1,
//             scale: 1,
//             stagger: 0.2,
//             duration: 0.7,
//             ease: "back.out(1.7)",
//           },
//           "<0.4",
//         )
//         .from(
//           ".banner-wave-bottom",
//           { y: 50, opacity: 0, duration: 1, ease: "power2.out" },
//           "<0.2",
//         );
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   const [email, setEmail] = useState("");
//   const [confirmation, setConfirmation] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent page reload
//     if (email.trim()) {
//       setConfirmation(`Thank you! We will notify ${email}.`);
//       setEmail(""); // Clear the input
//     }
//   };

//   return (
//     <div ref={sectionRef} className="mx-auto mt-16 w-full overflow-x-hidden">
//       <section
//         className="relative bg-[#BBDEFB]"
//         // style={{
//         //   backgroundImage: `url(${allBgImg})`,
//         // }}
//       >
//         {/* Top wave */}
//         <div className="banner-wave-top absolute top-0 left-1/2 z-10 -translate-x-1/2 overflow-hidden leading-none">
//           <EdgeWave />
//         </div>

//         {/* Overlay */}
//         {/* <div className="banner-overlay absolute inset-0 bg-black opacity-50" /> */}

//         {/* Content */}
//         <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-black sm:py-28 md:py-36 lg:py-40">
//           <h1 className="banner-headline font-fredoka max-w-2xl text-2xl leading-snug font-semibold sm:text-4xl md:text-5xl">
//             Never miss a party tip!
//           </h1>

//           <p className="banner-paragraph mt-4 text-sm sm:text-base">
//             Subscribe to our newsletter for the latest party planning ideas and
//             exclusive content
//           </p>

//           {/* Buttons */}
//           <div className="mt-0 flex flex-col gap-4 sm:flex-row md:mt-4">
//             <form
//               onSubmit={handleSubmit}
//               className="mx-auto mt-4 flex max-w-md flex-col gap-4 md:flex-row"
//             >
//               <label htmlFor="email-address" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email} // bind input to state
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="ring-secondary min-w-0 flex-auto rounded-lg border-1 border-black bg-transparent px-3.5 py-3 text-black shadow-sm ring-1 outline-0 ring-inset focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 md:min-w-md"
//                 placeholder="Enter your email"
//               />

//               <button
//                 type="submit"
//                 className="hover:bg-secondary-light flex-none cursor-pointer rounded-md bg-[#223B7D] px-4 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black"
//               >
//                 Notify me
//               </button>
//             </form>
//           </div>
//           {confirmation && (
//             <p className="mt-3 font-medium text-green-600">{confirmation}</p>
//           )}
//           <p className="mt-4 text-xs">
//             Join 10,000+ parents who love our tips! ✨
//           </p>
//         </div>

//         {/* Bottom wave */}
//         <div className="banner-wave-bottom absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180 overflow-hidden leading-none">
//           <EdgeWave />
//         </div>
//       </section>
//     </div>
//   );
// };

// export default NeverMissPartyTip;

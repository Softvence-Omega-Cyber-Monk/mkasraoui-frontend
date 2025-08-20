// import bgImage from "@/assets/videobanner.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef } from "react";
import { EdgeWave } from "../Icons";

gsap.registerPlugin(ScrollTrigger);

const NeverMissPartyTip: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
        .from(
          ".banner-wave-top",
          { y: -50, opacity: 0, duration: 1, ease: "power2.out" },
          "<0.2",
        )
        .from(
          ".banner-headline",
          { opacity: 0, y: 40, duration: 1.2, ease: "power4.out" },
          "<0.3",
        )
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
          "<0.4",
        )
        .from(
          ".banner-wave-bottom",
          { y: 50, opacity: 0, duration: 1, ease: "power2.out" },
          "<0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="mx-auto mt-16 w-full overflow-x-hidden">
      <section
        className="relative bg-[#BBDEFB]"
        // style={{
        //   backgroundImage: `url(${allBgImg})`,
        // }}
      >
        {/* Top wave */}
        <div className="banner-wave-top absolute top-0 left-1/2 z-10 -translate-x-1/2 overflow-hidden leading-none">
          <EdgeWave />
        </div>

        {/* Overlay */}
        {/* <div className="banner-overlay absolute inset-0 bg-black opacity-50" /> */}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-black sm:py-28 md:py-36 lg:py-40">
          <h1 className="banner-headline font-fredoka max-w-2xl text-2xl leading-snug font-semibold sm:text-4xl md:text-5xl">
            Never miss a party tip!
          </h1>

          <p className="banner-paragraph mt-4 text-sm sm:text-base">
            Subscribe to our newsletter for the latest party planning ideas and
            exclusive content
          </p>

          {/* Buttons */}
          <div className="mt-0 md:mt-4 flex flex-col gap-4 sm:flex-row">
            {/* <button
              ref={(el) => {
                buttonRefs.current[0] = el;
              }}
              className="gsap-hidden banner-button border-primary text-primary hover:bg-primary cursor-pointer rounded-lg border px-5 py-2 transition hover:text-white"
            >
              Get Started for Free
            </button>
            <button
              ref={(el) => {
                buttonRefs.current[1] = el;
              }}
              className="gsap-hidden banner-button border-secondary hover:bg-secondary-light bg-secondary inline-flex cursor-pointer items-center rounded-lg border px-5 py-2 text-white transition"
            >
              Start Planning Now
              <span className="ml-2 h-6">
                <OutlineArrow />
              </span>
            </button> */}
            <form className="mx-auto mt-4 flex max-w-md flex-col gap-4 md:flex-row">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-lg bg-transparent border-1 border-black  px-3.5 py-3 text-black shadow-sm ring-1 ring-secondary outline-0 ring-inset focus:ring-2 focus:ring-blue-600  sm:text-sm sm:leading-6 md:min-w-md"
                placeholder="Enter your email"
              />

              <button
                type="submit"

                className="flex-none rounded-md cursor-pointer bg-[#223B7D] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary-light focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black"

              >
                Notify me
              </button>
            </form>
          </div>
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

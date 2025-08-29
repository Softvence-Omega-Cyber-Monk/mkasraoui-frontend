import bgImage from "@/assets/bottom-banner.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { EdgeWave, OutlineArrow } from "../Icons";

gsap.registerPlugin(ScrollTrigger);

const PremiumBanner: React.FC = () => {
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
    <div ref={sectionRef} className="relative mx-auto w-full overflow-hidden">
      {/* Top wave */}
      <div className="banner-wave-top absolute top-0 left-1/2 z-10 -translate-x-1/2 overflow-hidden leading-none">
        <EdgeWave />
      </div>
      <section
        className="relative border-t border-b border-white bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Overlay */}
        <div className="banner-overlay absolute inset-0 bg-black opacity-50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-white sm:py-28 md:py-36 lg:py-44">
          <h1 className="banner-headline font-fredoka max-w-2xl text-2xl leading-snug font-semibold sm:text-4xl md:text-5xl">
            Ready to plan the perfect
            <br /> party?
          </h1>

          <p className="banner-paragraph mt-4 max-w-xl text-sm sm:text-base">
            Join thousands of parents who trust PartyPal for their celebrations
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to={"/auth/login"}>
              <button
                ref={(el) => {
                  buttonRefs.current[0] = el;
                }}
                className="gsap-hidden banner-button border-primary text-primary hover:bg-primary cursor-pointer rounded-lg border px-5 py-2 transition hover:text-white"
              >
                Get Started for Free
              </button>
            </Link>
            <Link to={"/home/premium-feature"}>
              <button
                ref={(el) => {
                  buttonRefs.current[1] = el;
                }}
                className="gsap-hidden banner-button border-secondary hover:bg-secondary-light bg-secondary inline-flex cursor-pointer items-center rounded-lg border px-5 py-2 text-white transition"
              >
                Plan your party
                <span className="ml-2 h-6">
                  <OutlineArrow />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>
      {/* Bottom wave */}
      <div className="banner-wave-bottom absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180 overflow-hidden leading-none">
        <EdgeWave />
      </div>
    </div>
  );
};

export default PremiumBanner;

/* eslint-disable @typescript-eslint/no-explicit-any */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered animation for the numbers and text
      const statBlocks = gsap.utils.toArray(".stat-block");

      gsap.from(statBlocks, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
      });

      // Count-up animation for the numbers
      statBlocks.forEach((block) => {
        const numberElement = (block as HTMLElement).querySelector(
          ".stat-number",
        );
        const originalText = (numberElement as HTMLElement)?.innerText;
        const hasK = originalText.toLowerCase().includes("k");
        const endValue = Number(originalText.replace(/[^0-9.]/g, ""));

        if (numberElement) {
          gsap.fromTo(
            numberElement,
            { textContent: "0" },
            {
              textContent: endValue.toString(),
              duration: 2,
              ease: "power3.out",
              snap: {
                textContent: 1,
              },
              scrollTrigger: {
                trigger: block as HTMLElement,
                start: "top 80%",
                toggleActions: "play none none none",
              },
              onUpdate: function (this: any) {
                const tweenedValue = Math.ceil(
                  Number(this.targets()[0].textContent),
                );
                let formattedText: string;

                if (hasK) {
                  // If the original text had 'K', format it with 'K+'
                  const currentValue = Math.ceil(tweenedValue / 1000);
                  formattedText = `${currentValue}K+`;
                } else {
                  // Otherwise, add a '+' if the original text had it
                  formattedText = `${tweenedValue}+`;
                }

                this.targets()[0].textContent = formattedText;
              },
            },
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="container mx-auto mt-10 px-4 sm:mt-16 md:mt-24 lg:px-5"
    >
      <div className="bg-secondary rounded-lg px-6 py-10 text-white sm:px-8 sm:py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 items-center justify-between gap-x-6 gap-y-10 text-center sm:grid-cols-2 md:grid-cols-4">
          <div className="stat-block">
            <div className="stat-number font-fredoka mb-2 text-4xl font-semibold sm:text-5xl md:text-6xl">
              2K+
            </div>
            <div className="text-sm font-light sm:text-base">Happy Kids</div>
          </div>
          <div className="stat-block">
            <div className="stat-number font-fredoka mb-2 text-4xl font-semibold sm:text-5xl md:text-6xl">
              35+
            </div>
            <div className="text-sm font-light sm:text-base">Expert Team</div>
          </div>
          <div className="stat-block">
            <div className="stat-number font-fredoka mb-2 text-4xl font-semibold sm:text-5xl md:text-6xl">
              15+
            </div>
            <div className="text-sm font-light sm:text-base">
              Years Experience
            </div>
          </div>
          <div className="stat-block">
            <div className="stat-number font-fredoka mb-2 text-4xl font-semibold sm:text-5xl md:text-6xl">
              100+
            </div>
            <div className="text-sm font-light sm:text-base">
              Custom Parties
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

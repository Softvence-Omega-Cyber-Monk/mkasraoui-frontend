import whoImg from "@/assets/who.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const WhoWeAre: React.FC = () => {
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    // We can use a ref for the button to be more specific.
    // Or you can stick to the class selector if you prefer.
    if (!buttonRef.current) return;

    gsap.set(buttonRef.current, {
      opacity: 0,
      scale: 0.7,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { duration: 1, ease: "power4.out" },
      });

      // Text blocks with scale + skew + fade in staggered
      tl.from(".who-left > *", {
        opacity: 0,
        scale: 0.85,
        skewX: 10,
        y: 30,
        transformOrigin: "left center",
        stagger: 0.25,
        ease: "elastic.out(1, 0.6)",
      })

        // Image reveal - scale + clip-path mask animation
        .from(
          ".who-image img",
          {
            scale: 1.2,
            clipPath: "inset(100% 0% 0% 0%)",
            ease: "power3.out",
            duration: 1.2,
          },
          "<",
        ) // start together with text

        // Button pulse scale + fade in with bounce ease
        .to(
          buttonRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(2)",
          },
          ">0.3",
        ); // after text & image
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="about" ref={sectionRef} className="mt-10 w-full sm:mt-16 md:mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-5">
        <main>
          <div className="grid items-center gap-12 sm:gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div className="who-left max-w-2xl space-y-6 sm:space-y-8">
              <div className="text-primary text-xl sm:text-2xl">Who we are</div>

              <h1 className="font-fredoka text-3xl leading-snug font-medium text-black sm:text-4xl lg:text-5xl">
                There's nothing more magical than a child's imagination
              </h1>

              <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
                From sparkles and balloons to themed adventures — we help bring
                your child's dream party to life in minutes with the power of
                AI.
              </p>

              {/* <Link
                to={"/home/party-generator"}
                ref={buttonRef}
                className="who-button bg-secondary hover:bg-secondary-dark cursor-pointer rounded-lg px-6 py-3 text-base text-white transition-colors sm:px-8 sm:py-3.5"
              >
                Plan My Party With AI
              </Link> */}
            </div>

            {/* Right Content - Party Image */}
            <div className="who-image relative overflow-hidden rounded-2xl sm:rounded-3xl">
              <img
                src={whoImg}
                alt="Happy children at birthday party with party hats and balloons"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WhoWeAre;

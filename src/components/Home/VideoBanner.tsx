import bgImage from "@/assets/videobanner.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useLayoutEffect, useRef, useState } from "react";
import { EdgeWave, PlayIcon } from "../Icons";

gsap.registerPlugin(ScrollTrigger);

const VideoBanner: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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

      tl.from(".video-overlay", { opacity: 0, duration: 1.2 })
        .from(".video-wave-top", { y: -50, opacity: 0, duration: 1 }, "<0.2")
        .from(".video-headline", { y: 40, opacity: 0, duration: 1.1 }, "<0.2")
        .from(".video-paragraph", { y: 20, opacity: 0, duration: 0.8 }, "<0.2")
        .to(
          buttonRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          "<0.3",
        )
        .from(".video-wave-bottom", { y: 50, opacity: 0, duration: 1 }, "<0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative mx-auto mt-16 w-full overflow-hidden"
    >
      {/* Top wave */}
      <div className="video-wave-top absolute top-0 left-1/2 z-10 -translate-x-1/2 overflow-hidden leading-none">
        <EdgeWave />
      </div>

      <section
        className="relative border-t border-b border-white bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Overlay */}
        <div className="video-overlay bg-primary absolute inset-0 opacity-45" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-white sm:py-28 md:py-36 lg:py-40">
          <h1 className="video-headline font-fredoka max-w-2xl text-2xl leading-snug font-semibold sm:text-4xl md:text-5xl">
            Wishing you a day full of
            <br /> happiness and joy
          </h1>

          <p className="video-paragraph mt-4 max-w-xl text-sm sm:text-base">
            Take a moment to celebrate life’s simple joys. Watch our short video
            and feel the warmth of happiness, inspiration, and positivity flow
            through your day.
          </p>

          {/* Play Button */}
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(true)}
            className="gsap-hidden text-primary mt-8 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105 sm:h-20 sm:w-20"
          >
            <PlayIcon />
          </button>
        </div>
      </section>

      {/* Bottom wave */}
      <div className="video-wave-bottom absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180 overflow-hidden leading-none">
        <EdgeWave />
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative aspect-video w-full max-w-3xl">
            {/* Example YouTube iframe */}
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/tCDvOQI3pco?autoplay=1"
              title="10 Second Timer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-2xl text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBanner;

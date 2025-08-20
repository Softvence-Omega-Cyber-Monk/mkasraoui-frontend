import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bgImage from "../../assets/main-bg.jpg";

const Hero = () => {
  const heroRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Immediately set the initial state of the button.
    gsap.set(ctaRef.current, {
      opacity: 0,
      scale: 0.8,
    });

    const ctx = gsap.context(() => {
      // Background scale zoom
      gsap.fromTo(
        ".hero-bg",
        { scale: 1.1 },
        { scale: 1, duration: 2, ease: "power2.out" },
      );

      // Badge
      gsap.from(".hero-badge", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3,
      });

      // Heading
      gsap.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5,
      });

      // Subheadline
      gsap.from(".hero-sub", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.8,
      });

      // Button
      // Now using a `gsap.to()` animation to animate to the final visible state.
      gsap.to(ctaRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 1.1,
      });
    }, heroRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <section ref={heroRef} className="relative h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Party Background"
        className="custom-image-curve hero-bg absolute inset-0 z-0 h-full w-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="custom-image-curve absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/40 to-black/70 transition-all duration-500 ease-in-out" />

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Tagline Badge */}
        <div className="hero-badge mb-4 rounded-full border border-white/45 bg-black/10 px-3 py-2 text-xs text-white shadow backdrop-blur md:text-sm">
          ✨ New: AI-Powered Party Planning
        </div>

        {/* Headline */}
        <h1 className="hero-title font-fredoka mb-4 text-4xl leading-tight font-semibold text-white drop-shadow-md sm:text-5xl md:text-6xl">
          Organize your child’s
          <br />
          <span className="text-white">party in a few clicks</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub mx-auto mb-10 max-w-2xl text-sm font-light text-[#F4F5F7] sm:text-base md:mb-16">
          From theme ideas to a full schedule, our AI assistant helps you create
          a magical and unforgettable celebration effortlessly.
        </p>

        {/* CTA Button */}
        <Link
          to={"/home/party-generator"}
          ref={ctaRef}
          className="hero-cta bg-secondary hover:bg-secondary-light cursor-pointer rounded-lg px-5 py-2 text-sm text-white transition duration-200 md:px-7 md:py-3.5 md:text-base"
        >
          Plan My Party With AI
        </Link>
      </div>
    </section>
  );
};

export default Hero;

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import chelsea from "@/assets/profile/chelsea.jpg";
import libby from "@/assets/profile/libby.jpg";
import tilly from "@/assets/profile/tilly.jpg";
import split from "@/assets/split.png";
import split2 from "@/assets/split_2.png";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const testimonials = [
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      name: "Libby Conway",
      location: "Jakarta",
      avatar: libby,
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      name: "Chelsea Parker",
      location: "Jakarta",
      avatar: chelsea,
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      name: "Tilly Gordon",
      location: "Jakarta",
      avatar: tilly,
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      name: "Libby Conway",
      location: "Jakarta",
      avatar: libby,
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      name: "Chelsea Parker",
      location: "Jakarta",
      avatar: chelsea,
    },
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      name: "Tilly Gordon",
      location: "Jakarta",
      avatar: tilly,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 24 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 32 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  useEffect(() => {
    const play = () => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    };
    timerRef.current = setInterval(play, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [instanceRef]);

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

      // Animate the header
      tl.from(".testimonials-header", { opacity: 0, y: 20 })
        // Animate the split line
        .from(
          ".testimonials-split",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "power2.out",
          },
          "<0.2",
        )
        // Animate the title
        .from(
          ".testimonials-title",
          { opacity: 0, y: 30, duration: 1, ease: "power4.out" },
          "<0.3",
        )
        // Animate the description
        .from(
          ".testimonials-desc",
          { opacity: 0, y: 20, duration: 0.8 },
          "<0.3",
        )
        // Animate the slider itself
        .from(
          ".keen-slider",
          {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power3.out",
          },
          "<0.5",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="testimonial"
      ref={sectionRef}
      className="relative container mx-auto mt-10 overflow-hidden px-4 py-8 sm:py-12 md:py-16 lg:px-5"
    >
      {/* Background Decoration */}
      <div className="absolute bottom-20 left-2 opacity-40 sm:left-10">
        <img src={split2} alt="" />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl text-center">
        {/* Header */}
        <div className="testimonials-header mb-8 flex flex-col items-center justify-center sm:flex-row sm:gap-2">
          <span className="text-primary text-lg font-medium sm:text-xl">
            Testimonials
          </span>
          <div className="testimonials-split relative mt-2 w-10 sm:-top-6 sm:left-8 sm:mt-0">
            <img src={split} alt="split line" className="mx-auto sm:mx-0" />
          </div>
        </div>

        {/* Title */}
        <h2 className="testimonials-title font-fredoka mb-4 text-2xl leading-snug font-semibold text-[#191919] sm:mb-6 sm:text-4xl sm:leading-tight md:text-5xl md:font-bold">
          Our Happy Parents
        </h2>

        {/* Description */}
        <p className="testimonials-desc mx-auto mb-10 max-w-xl px-2 text-sm text-[#5A5C5F] sm:mb-16 sm:px-0 sm:text-base md:text-lg">
          Hear from other parents who have used our AI Party Planner to create
          unforgettable celebrations for their children.
        </p>

        {/* Slider */}
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="keen-slider__slide flex flex-col items-center px-2 sm:px-0"
              >
                <div className="relative z-10 rounded-2xl bg-[#F6F6F6] p-8">
                  <p className="leading-relaxed text-gray-600 italic">
                    {testimonial.text}
                  </p>
                  <div className="arrow-down absolute -bottom-2.5 left-1/2 z-40 -translate-x-1/2" />
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-[52px] w-[52px] rounded-full object-cover"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-start">
                      <p className="font-semibold text-[#6C7272]">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-[#6C7272]">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {loaded && instanceRef.current && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="text-primary absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer p-4 text-xl sm:-left-12"
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="text-primary absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer p-4 text-xl sm:-right-12"
              >
                <FaAngleRight />
              </button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {loaded && instanceRef.current && (
          <div className="mt-6 flex justify-center gap-2">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`rounded-full ${
                  currentSlide === idx ? "bg-primary" : "bg-gray-300"
                } h-3 w-3 sm:h-2 sm:w-2`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

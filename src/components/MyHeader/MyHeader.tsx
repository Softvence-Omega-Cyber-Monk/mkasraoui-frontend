import bgImage from "@/assets/party.png";
import React from "react";

interface MyHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

const MyHeader: React.FC<MyHeaderProps> = ({
  title,
  subtitle,
  className = "",
}) => {
  return (
    <section
      className={`relative bg-cover bg-center ${className}`}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-[#191919] sm:py-32 md:py-40 lg:py-44">
        <h1 className="font-fredoka max-w-2xl text-2xl leading-snug font-semibold sm:text-4xl md:text-6xl">
          {title}
        </h1>

        <p className="mt-4 max-w-xl text-sm text-[#595959] sm:text-base">
          {subtitle}
        </p>
        {/* 
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button className="border-secondary hover:bg-secondary-light bg-secondary inline-flex cursor-pointer items-center rounded-lg border px-5 py-2.5 text-base text-white transition">
            Start Planning Now
            <span className="ml-2 h-6">
              <OutlineArrow />
            </span>
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default MyHeader;

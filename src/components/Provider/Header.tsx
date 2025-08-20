import bgImage from "@/assets/party.png";
import { OutlineArrow } from "@/components/Icons";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <section
      className="relative bg-[#F6F6F666] bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-[#191919] sm:py-28 md:py-36 lg:py-40">
        <h1 className="font-fredoka max-w-2xl text-3xl leading-snug font-semibold sm:text-5xl md:text-6xl">
          Party Service Providers
        </h1>

        <p className="mt-4 max-w-xl text-sm text-[#595959] sm:text-base">
          Find trusted local professionals to make your party absolutely perfect
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            to={"#"}
            className="border-secondary hover:bg-secondary-light bg-secondary inline-flex cursor-pointer items-center rounded-lg border px-5 py-2.5 text-base text-white transition"
          >
            Become a Provider
            <span className="ml-2 h-6">
              <OutlineArrow />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Header;

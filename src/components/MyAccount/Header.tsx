import bgImage from "@/assets/party.png";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { EdgeWaveNarrow } from "../Icons";
const Header = () => {
  return (
    <section
      className="relative mx-auto w-full overflow-x-hidden bg-[#BBDEFB] bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-[#191919] sm:py-28 md:py-36 lg:py-40">
        <h1 className="font-fredoka max-w-3xl text-2xl leading-snug font-semibold sm:text-5xl md:text-6xl">
          Welcome back,
          <br />
          Sarah!
        </h1>

        <p className="mt-4 max-w-xl text-sm text-[#595959] sm:text-base">
          Ready to plan your next amazing party?
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            to={"/home/party-generator"}
            className="border-secondary hover:bg-secondary-light bg-secondary inline-flex cursor-pointer items-center rounded-lg border px-5 py-2.5 text-base text-white transition"
          >
            <span className="mr-2 h-5">
              <Plus className="h-5 w-5" />
            </span>
            Next Party
          </Link>
        </div>
      </div>
      {/* Bottom wave */}
      <div className="banner-wave-bottom absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden leading-none">
        <EdgeWaveNarrow />
      </div>
    </section>
  );
};

export default Header;

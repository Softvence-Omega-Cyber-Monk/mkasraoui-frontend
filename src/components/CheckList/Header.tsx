import bgImage from "@/assets/party.png";
const Header = () => {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24 text-center text-[#191919] sm:py-24 md:py-28 lg:py-36">
        <h1 className="font-fredoka max-w-2xl text-3xl leading-snug font-semibold sm:text-5xl md:text-6xl">
          Party Planning Checklist
        </h1>

        <p className="mt-4 max-w-xl text-sm text-[#595959] sm:text-base">
          Tell us about your party, and our AI will create the perfect plan in minutes!
        </p>

        {/* Buttons */}
        
      </div>
    </section>
  );
};

export default Header;

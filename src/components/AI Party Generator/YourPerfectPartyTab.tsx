import {
  BookmarkIcon,
  Boxes,
  Download,
  ListChecks,
  Mail,
  Music,
  RefreshCcw,
  ShoppingCartIcon,
} from "lucide-react";
// import sortVideo from "../../public/sort-img.mp4";
import sortVideo from "../../../public/sort-img.mp4";
import gift1 from "@/assets/giftImg-1.jpg";
import gift2 from "@/assets/gioftImg-2.jpg";
import gift3 from "@/assets/giftImg-3.jpg";
import QCode from "@/assets/Qcode.png";
import musicImg1 from "@/assets/mic1.png";
import musicImg2 from "@/assets/mic-2.png";
import musicImg3 from "@/assets/mic-3.png";

function YourPerfectPartyTab({
  setActiveStep,
}: {
  setActiveStep: (step: string) => void;
}) {
  const gifts = [
    {
      id: 1,
      title: "LEGO Superhero Building Set",
      description: "Perfect for creative building and superhero adventures",
      price: "$24.99",
      retailer: "Amazon",
      image: gift1, // Using the provided image
    },
    {
      id: 2,
      title: "Superhero Cape & Mask Set",
      description: "High-quality costume pieces for dress-up fun",
      price: "$30.99",
      retailer: "Etsy",
      image: gift2, // Placeholder for superhero costumes
    },
    {
      id: 3,
      title: "Hero Action Figure Collection ",
      description: "Collectible figures for imaginative play Amazon",
      price: "$35.99",
      retailer: "Amazon",
      image: gift3, // Placeholder for action figures
    },
  ];
  // fak data for  musicCards
  const musicCards = [
    {
      id: 1,
      title: "Superhero Theme Songs",
      description: "Epic superhero movie soundtracks and theme songs",
      platform: "YouTube",
      image: musicImg1,
    },
    {
      id: 2,
      title: "Kids Dance Party Mix",
      description: "High-energy songs perfect for kids' dance time",
      platform: "Spotify",
      image: musicImg2,
    },
    {
      id: 3,
      title: "Happy Birthday Remixes",
      description: "Fun birthday song variations and remixes",
      platform: "YouTube",
      image: musicImg3,
    },
  ];
  const titles = [
    "30 min before: Setup decorations",
    "Party start: Welcome & costume photos",
    "First 30 min: Superhero training",
    "Food & cake time",
    "Final 30 min: Games & prizes",
  ];
  return (
    <div className="container mx-auto">
      <div className="bg-white px-8 pt-10 pb-24">
        {/* Header */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="font-fredoka mb-3 text-base font-semibold text-gray-900 md:text-2xl">
            <span>🎉</span>
            Your Perfect Party Plan is Ready!
          </h1>
          <p className="text-base text-gray-600">
            Here's what our AI created just for you
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="mb-12 grid gap-8 px-8 md:grid-cols-2">
          {/* Theme & Decorations */}
          <div className="mt-6">
            <div className="mb-6">
              <h3 className="text-md font-fredoka font-semibold text-[#223B7D] md:text-xl">
                🎨 Theme & Decorations
              </h3>
            </div>

            <div className="mb-5">
              <span className="inline-block rounded-full bg-[#223B7D] px-6 py-3 text-xs font-medium text-white md:text-sm">
                Superhero Adventure
              </span>
            </div>

            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#223B7D]"></div>
                <span>Superhero banners and balloons</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#223B7D]"></div>
                <span>City skyline backdrop</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#223B7D]"></div>
                <span>Comic book style table settings</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#223B7D]"></div>
                <span>LED string lights in primary colors</span>
              </li>
            </ul>
          </div>

          {/* Fun Activities */}
          <div className="mt-6">
            <div className="mb-4">
              <h3 className="font-fredoka text-xl font-semibold text-[#191919]">
                🎯 Fun Activities
              </h3>
            </div>

            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                <span>Superhero training obstacle course</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                <span>Design your own superhero mask</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                <span>Pin the cape on the superhero</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400"></div>
                <span>Superhero dance party</span>
              </li>
            </ul>
          </div>

          {/* Food & Treats */}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-3">
              <h3 className="font-fredoka text-xl font-semibold text-[#223B7D]">
                🍰 Food & Treats
              </h3>
            </div>

            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#FFD54F]"></div>
                <span>Hero sandwiches with fun names</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#FFD54F]"></div>
                <span>Power-up fruit kabobs</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#FFD54F]"></div>
                <span>Superhero cake with cape design</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#FFD54F]"></div>
                <span>Comic book cookies</span>
              </li>
            </ul>
          </div>

          {/* Party Supplies  */}
          <div className="mt-6">
            <div className="mb-3">
              <h3 className="font-fredoka text-xl font-semibold text-[#191919]">
                🛍️ Party Supplies
              </h3>
            </div>

            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#F8BBD0]"></div>
                <span>Superhero capes for each guest</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#F8BBD0]"></div>
                <span>Mask-making supplies</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#F8BBD0]"></div>
                <span>Activity prizes and stickers</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <div className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#F8BBD0]"></div>
                <span>Themed party favors</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Party Timeline  bottom part*/}
        <div className="border-t border-[#E2E2E2] p-6 pt-8">
          <div className="mb-6">
            <h3 className="font-fredoka text-xl font-semibold text-gray-900">
              ⏰ Party Timeline
            </h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {titles.map((title, index) => (
              <div
                key={index}
                className="relative mb-4 overflow-hidden rounded-md border border-blue-400 px-6 py-1.5"
              >
                {/* Background Video */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 z-0 h-full w-full object-cover"
                >
                  <source src={sortVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Black overlay */}
                <div className="absolute inset-0 z-10 bg-black/60"></div>

                {/* Text content */}
                <div className="relative z-20">
                  <h1 className="text-base font-normal text-white">{title}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* card section  */}
        <div>
          {/* Product Cards Grid */}
          <div className="mt-8 mb-12 flex flex-col content-center justify-between gap-4 border-t border-[#E2E2E2] pt-10 md:flex-row md:gap-0">
            <div>
              <h2 className="font-fredoka text-2xl font-semibold">
                🎁 Suggested Gifts
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Based on age and theme, here are great gift ideas:
              </p>
            </div>
            <button className="cursor-pointer rounded-md border px-6 py-2">
              <RefreshCcw className="mr-2 inline h-4 w-4" />
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="overflow-hidden rounded-3xl border border-[#DFE1E6] bg-white p-3"
              >
                <div className="relative">
                  <img
                    src={gift.image || "/placeholder.svg"}
                    alt={gift.title}
                    className="h-48 w-full rounded-xl object-cover"
                  />
                  <button className="absolute top-3 right-3 cursor-pointer rounded-sm bg-white p-2 shadow-sm hover:bg-gray-50">
                    <BookmarkIcon />
                  </button>
                </div>
                <div className="p-2">
                  <h3 className="mb-2 font-bold text-gray-900">{gift.title}</h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {gift.description}
                  </p>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-[#223B7D]">
                      {gift.price}
                    </span>
                    <span className="rounded-md border border-[#DFE1E6] px-2 py-1 text-sm text-gray-500">
                      {gift.retailer}
                    </span>
                  </div>
                  <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#223B7D] px-4 py-2 text-sm font-normal text-white transition-colors hover:bg-blue-900">
                    <ShoppingCartIcon />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 🎶 Party Music Playlist for Superhero Adventure */}
        <div>
          <div className="mt-8 mb-12 flex flex-col content-center justify-between gap-4 border-t border-[#E2E2E2] pt-10 md:flex-row md:gap-0">
            <div>
              <h2 className="font-fredoka text-2xl font-semibold">
                🎶 Party Music Playlist for Superhero Adventure
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Get the party started with this curated playlist:
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {musicCards.map((card) => (
              <div
                key={card.id}
                className="overflow-hidden rounded-xl border border-[#DFE1E6] bg-white transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start gap-4">
                    <div
                      className={`flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg`}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 line-clamp-2 text-base font-bold text-gray-900">
                        {card.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="rounded-md border border-[#DFE1E6] px-2 py-1 text-sm text-gray-500">
                      {card.platform}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="flex cursor-pointer items-center gap-2 rounded-md bg-[#223B7D] px-8 py-2 font-normal text-white shadow-md transition-colors duration-200 hover:bg-blue-800 hover:shadow-lg">
                      <Music size={18} />
                      Listen
                    </button>

                    <div className="flex h-12 w-12 items-center justify-center bg-gray-50">
                      {/* <QrCode size={24} className="text-gray-400" /> */}
                      <img src={QCode} alt="" className="" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* button group  */}

        <div className="mt-10 flex flex-col content-center justify-center gap-6 border-t border-[#E2E2E2] pt-8 md:flex-row">
          <button className="cursor-pointer rounded border px-6 py-2">
            {" "}
            <Mail height={24} width={24} className="mr-2 inline" /> Email Plan
          </button>
          <button className="cursor-pointer rounded border px-6 py-2">
            {" "}
            <ListChecks height={24} width={24} className="mr-2 inline" /> Create
            Checklist
          </button>
          <button className="cursor-pointer rounded border px-6 py-2">
            {" "}
            <Boxes height={24} width={24} className="mr-2 inline" /> View More
            Gifts
          </button>
          <button className="cursor-pointer rounded bg-[#223B7D] px-6 py-2 text-white">
            {" "}
            <Download height={24} width={24} className="mr-2 inline" /> View
            More Gifts
          </button>
        </div>
      </div>
      <div className="mt-20 flex justify-center pb-10">
        <button
          className="hover:bg-secondary-light cursor-pointer rounded border border-[#DFE1E6] px-6 py-3 hover:text-white"
          onClick={() => setActiveStep("Basis Info")}
        >
          Plan Another Party
        </button>
      </div>
    </div>
  );
}

export default YourPerfectPartyTab;

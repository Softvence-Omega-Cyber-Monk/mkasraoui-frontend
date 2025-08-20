import { useParams } from "react-router-dom";
import boxImg1 from "@/assets/box-img-1.jpg";
import boxImg2 from "@/assets/box-img-2.jpg";
import boxImg3 from "@/assets/box-img-3.jpg";
import boxImg4 from "@/assets/box-img-4.jpg";
import boxImg5 from "@/assets/box-img-1.jpg";
import boxImg6 from "@/assets/box-img-6.jpg";
import videoImg from "@/assets/videobanner.jpg";
import { CircleCheckBig, Clock, Play } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import bannerImg from "@/assets/party-banner-bg.png";
import { useState } from "react";
import PremiumBanner from "@/components/Home/PremiumBanner";
import MyHeader from "@/components/MyHeader/MyHeader";

export default function DiyBoxDetails() {
  const { id } = useParams();
  // fak data for map
  const activities = [
    {
      id: 1,
      title: "Superhero Adventure Box",
      description:
        "Transform your party into an epic superhero adventure with capes, masks, and heroic activities! This complete party box includes everything you need to create an unforgettable experience for your little heroes.",
      image: boxImg1,
      tag: "Superhero",
      tagColor: "bg-blue-600",
      duration: "30 min",
      ageRange: "Up to 12 kids",
      rating: 4.9,
      reviews: 124,
      price: 49.99,
      originalPrice: 69.99,
      ageTag: "Ages 4-8 years",
      ageTagColor: "bg-green-500",
    },
    {
      id: 2,
      title: "Princess Magical Kingdom",
      description:
        "Create a magical kingdom with crowns, wands, and enchanting decorations for royalty!",
      image: boxImg2,
      tag: "Princess",
      tagColor: "bg-purple-600",
      duration: "25 min",
      ageRange: "Up to 12 kids",
      rating: 4.9,
      reviews: 96,
      price: 54.99,
      originalPrice: 74.99,
      ageTag: "Ages 3-7 years",
      ageTagColor: "bg-green-500",
    },
    {
      id: 3,
      title: "Dinosaur Discovery Adventure",
      description:
        "Embark on a prehistoric journey with fossil hunting, dino crafts, and Jurassic fun!",
      image: boxImg3,
      tag: "Dinosaur",
      tagColor: "bg-orange-600",
      duration: "35 min",
      ageRange: "Up to 15 kids",
      rating: 4.7,
      reviews: 124,
      price: 45.99,
      originalPrice: 59.99,
      ageTag: "Ages 4-9 years",
      ageTagColor: "bg-green-500",
    },
    {
      id: 4,
      title: "Space Explorer Mission",
      description:
        "Blast off into space with world building, planet exploration, and cosmic adventures!",
      image: boxImg4,
      tag: "Universe",
      tagColor: "bg-indigo-600",
      duration: "40 min",
      ageRange: "Up to 12 kids",
      rating: 4.9,
      reviews: 124,
      price: 52.99,
      originalPrice: 69.99,
      ageTag: "Ages 6-8 years",
      ageTagColor: "bg-green-500",
    },
    {
      id: 5,
      title: "Unicorn Rainbow Party",
      description:
        "Create a magical unicorn wonderland with rainbows, sparkles, and enchanted fun!",
      image: boxImg5,
      tag: "Unicorn",
      tagColor: "bg-pink-500",
      duration: "30 min",
      ageRange: "Up to 12 kids",
      rating: 4.9,
      reviews: 124,
      price: 49.99,
      originalPrice: 49.99,
      ageTag: "Ages 3-8 years",
      ageTagColor: "bg-green-500",
    },
    {
      id: 6,
      title: "Pirate Treasure Hunt",
      description:
        "Ahoy matey! Hunt for treasure with maps, costumes, and swashbuckling adventures!",
      image: boxImg6,
      tag: "Pirate",
      tagColor: "bg-red-600",
      duration: "30 min",
      ageRange: "Up to 12 kids",
      rating: 4.0,
      reviews: 124,
      price: 49.99,
      originalPrice: 49.99,
      ageTag: "Ages 4-9 years",
      ageTagColor: "bg-green-500",
    },
  ];

  const activity = activities.find((item) => item.id === Number(id));

  // this is for show rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  const [activeTab, setActiveTab] = useState("whats-included");

  const tabs = [
    { id: "whats-included", label: "What's Included" },
    { id: "activities", label: "Activities" },
    { id: "tutorial", label: "Tutorial" },
    { id: "reviews", label: "Reviews" },
  ];

  const whatsIncludedItems = [
    { text: "12 Superhero capes in assorted colors" },
    { text: "Cityscape backdrop banner" },
    { text: "Comic book style table decorations" },
    { text: "Activity instruction cards" },
  ];

  const whatsIncludedItemsRight = [
    { text: "12 Hero masks (DIY decorating kit)" },
    { text: "Superhero training certificate templates" },
    { text: "Hero power-up snack labels" },
    { text: "Digital tutorial video access" },
  ];

  const activitiesCartData = [
    {
      id: "1",
      title: "Superhero Training Course",
      description:
        "Transform your party into an epic superhero adventure with capes, masks, and heroic activities! This complete party box includes everything you need to create an unforgettable experience for your little heroes.",
      duration: "20 minutes",
    },
    {
      id: "2",
      title: "Design Your Hero Mask",
      description: "Creative craft activity with decorating supplies",
      duration: "20 minutes",
    },
    {
      id: "3",
      title: "Hero Photo Booth",
      description: "Professional backdrop for memorable photos",
      duration: "15 minutes",
    },
    {
      id: "4",
      title: "Save the City Game",
      description: "Interactive team game with mission cards",
      duration: "30 minutes",
    },
  ];

  // data for review
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      timestamp: "2 weeks ago",
      rating: 5,
      text: "Amazing box! My son's 6th birthday was perfect. The kids loved the training course and the capes were high quality.",
    },
    {
      id: 2,
      name: "Sarah M.",
      timestamp: "2 weeks ago",
      rating: 4,
      text: "Amazing box! My son's 6th birthday was perfect. The kids loved the training course and the capes were high quality.",
    },
    {
      id: 3,
      name: "Sarah M.",
      timestamp: "2 weeks ago",
      rating: 4.5,
      text: "Amazing box! My son's 6th birthday was perfect. The kids loved the training course and the capes were high quality.",
    },
    {
      id: 4,
      name: "Sarah M.",
      timestamp: "2 weeks ago",
      rating: 3,
      text: "Amazing box! My son's 6th birthday was perfect. The kids loved the training course and the capes were high quality.",
    },
  ];

  // this is tab content
  const renderContent = () => {
    switch (activeTab) {
      case "whats-included":
        return (
          <div className="rounded-xl border border-[#DFE1E6] bg-white p-8">
            <h2 className="mb-8 text-2xl text-gray-900">
              Everything You Need for an Amazing Party
            </h2>
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
              <div className="space-y-4">
                {whatsIncludedItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CircleCheckBig className="text-[#22C55E]" />
                    <span className="leading-relaxed text-gray-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {whatsIncludedItemsRight.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CircleCheckBig className="text-[#22C55E]" />
                    <span className="leading-relaxed text-gray-700">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "activities":
        return (
          <div className="">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {activitiesCartData.map((item) => (
                <div
                  key={item.id}
                  className="shadow-card hover:shadow-card-hover cursor-pointer rounded-xl border border-[#DFE1E6] bg-white p-6 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl leading-tight font-medium text-[#191919]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5A5C5F]">
                      {item.description}
                    </p>
                    <button className="rounded-full border border-[#DFE1E6] px-4 py-1 text-xs font-medium text-[#5A5C5F]">
                      {item.duration}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "tutorial":
        return (
          <div className="py-10">
            <div className="rounded-2xl bg-[#DFE1E6]/60 p-6">
              {/* Image Container with overlay and content */}
              <div className="relative h-[16rem] w-auto md:h-[32rem]">
                {/* Background Image */}
                <img
                  src={videoImg}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />

                {/* Black Overlay */}
                <div className="absolute inset-0 rounded-lg bg-black/50"></div>

                {/* Centered Play Button and Text */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
                  {/* Play Button */}
                  <div className=" ">
                    {/* <Play height={26} width={26}/> */}
                    <Play className="h-12 w-12" />
                  </div>

                  {/* Text */}
                  <h2 className="mt-4 mb-2 text-xl font-medium sm:text-2xl">
                    Setup Tutorial Video
                  </h2>
                  <p className="px-2 text-center text-base sm:text-lg">
                    Learn how to set up your superhero party in just 30 minutes
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <button className="hover:bg-secondary-light mt-8 flex items-center gap-2 rounded-lg bg-[#223B7D] px-6 py-3 text-white">
                  <Play />
                  Watch Tutorial
                </button>
              </div>
            </div>
          </div>
        );
      case "reviews":
        return (
          <div className="">
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-xl font-medium text-gray-900">
                      {review.name}
                    </h3>
                    <span className="text-lg text-gray-500">
                      {review.timestamp}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-lg leading-relaxed text-[#5A5C5F]">
                    {review.text}
                  </p>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button className="cursor-pointer rounded-md bg-[#223B7D] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-800">
                  View All
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // this is   a main  part
  return (
    <div className="pb-0 md:pb-20">
      {/* <div
        className="relative -z-1  h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      ></div> */}
      <MyHeader
        title=" "
        subtitle="r"
        className="-z-1 text-3xl sm:text-5xl md:text-6xl"
      ></MyHeader>
      <div className="container mx-auto -mt-84">
        <div className="overflow-hidden rounded-2xl p-4">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Product Images */}
            <div className="lg:w-1/2">
              <div className="mb-4 h-[70vh] w-auto">
                <img
                  src={activity?.image}
                  alt="Superhero Adventure Box with figurines"
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>

              {/* Thumbnail images */}
              <div className="flex gap-3">
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-200">
                  <img
                    src={activity?.image}
                    alt="Thumbnail 1"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-200">
                  <img
                    src={activity?.image}
                    alt="Thumbnail 2"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-200">
                  <img
                    src={activity?.image}
                    alt="Thumbnail 2"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Product Details */}
            <div className="p-6 lg:w-1/2 lg:p-8">
              {/* Badges */}
              <div className="mb-4 flex gap-2">
                <span className="rounded-full bg-[#223B7D] px-3 py-2 text-sm text-white">
                  {activity?.tag}
                </span>
                <span
                  className={`rounded-full bg-[#58C06478]/70 px-3 py-2 text-sm text-[#19AE19]`}
                >
                  {activity?.ageTag}
                </span>
              </div>

              {/* Product Title */}
              <h3 className="font-fredoka mb-2 text-xl font-semibold text-[#191919] md:text-3xl">
                {activity?.title}
              </h3>

              {/* Product Description */}
              <p className="mb-4 w-[80%] text-lg text-[#5A5C5F]">
                {activity?.description}
              </p>

              {/* Rating */}
              <div className="mb-4 flex items-center gap-4 text-xl">
                <div className="flex items-center">
                  {renderStars(activity?.rating ?? 0)}
                </div>
                <span className="font-semibold text-gray-900">4.9</span>
                <span className="text-gray-500">(124 reviews)</span>
              </div>

              {/* Duration and Capacity */}
              <div className="mb-6 flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {activity?.duration}
                </div>
                <div>
                  <span>Up to 12 kids</span>
                </div>
              </div>

              {/* Save Badge */}
              <div className="mb-4">
                <span className="rounded-full bg-[#FF5630] px-4 py-1.5 text-sm font-normal text-white">
                  SAVE $20
                </span>
              </div>

              {/* Price */}
              <div className="mt-8 mb-6 md:mb-12">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-[#223B7D] md:text-5xl">
                    ${activity?.price}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ${activity?.originalPrice}
                  </span>
                </div>
              </div>

              {/* Shop Now Button */}
              <button className="hover:bg-secondary-light w-full cursor-pointer rounded-lg bg-[#223B7D] px-8 py-4 font-semibold text-white transition-colors duration-200">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* teb section  */}
      <div className="mx-auto mt-10 max-w-7xl px-4">
        <div className="overflow-hidden rounded-lg p-4">
          {/* Tab Navigation */}
          <div className="flex overflow-x-scroll rounded-xl border-b border-gray-200 bg-[#F5F5F5] p-2 md:overflow-x-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 cursor-pointer px-6 py-3 text-center font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "rounded-md bg-[#223B7D] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-10 mb-18 bg-white">{renderContent()}</div>
        </div>
      </div>
      {/* here add Love (this theme?) section */}
      <div>
        <PremiumBanner />
      </div>
    </div>
  );
}

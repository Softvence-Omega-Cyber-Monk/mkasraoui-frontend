import { useParams } from "react-router-dom";
import shop1 from "@/assets/shop-1.jpg";
import shop2 from "@/assets/shop-2.jpg";
import shop3 from "@/assets/shop-3.jpg";
import shop4 from "@/assets/shop-4.jpg";
import shop5 from "@/assets/shop-5.jpg";
import shop6 from "@/assets/shop-6.jpg";
import videoImg from "@/assets/videobanner.jpg";
import { CircleCheckBig, Clock, Play } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import bannerImg from "@/assets/party-banner-bg.png";
import { useState } from "react";

export default function ShopDetails() {
  const { id } = useParams();
  // fak data for map
  const activities = [
    {
      id: 1,
      image: shop1,
      imageAlt: "Personalized Birthday T-Shirt",
      title: "Personalized Birthday T-Shirt",
      description:
        "Custom birthday t-shirt with child's name, age, and fun themes",
      rating: 4.9,
      reviews: 824,
      currentPrice: "$12.9",
      originalPrice: "$16.9",
      tags: ["Premium cotton", "Custom design", "Fast delivery"],
      buttonText: "Customize T-Shirt",
      buttonVariant: "orange" as const,
      duration: "2-3 days",
      ageRange: "4-12 years",
      price: 12.9,
      ageTag: "Kids",
      tag: "New",
    },
    {
      id: 2,
      image: shop2,
      imageAlt: "Superhero Cape & Mask Set",
      title: "Superhero Cape & Mask Set",
      description:
        "Transform into a superhero with this premium cape and mask combo",
      rating: 4.9,
      reviews: 124,
      currentPrice: "$49.99",
      originalPrice: "$49.99",
      tags: ["Satin cape", "Felt mask", "Adjustable straps"],
      buttonText: "Buy Now",
      buttonVariant: "blue" as const,
    },
    {
      id: 3,
      image: shop3,
      imageAlt: "Art & Craft item Box",
      title: "Art & Craft item Box",
      description:
        "Build a shark, squid, or anglerfish with this amazing 3-in-1 set",
      rating: 4.9,
      reviews: 124,
      currentPrice: "$49.99",
      originalPrice: "$49.99",
      tags: ["50+ supplies", "Project guide", "Storage box"],
      buttonText: "Buy Now",
      buttonVariant: "blue" as const,
    },
    {
      id: 4,
      image: shop4,
      imageAlt: "Interactive Learning Tablet",
      title: "Interactive Learning Tablet",
      description:
        "Build a shark, squid, or anglerfish with this amazing 3-in-1 set",
      rating: 4.9,
      reviews: 124,
      currentPrice: "$49.99",
      originalPrice: "$49.99",
      tags: ["100+ activities", "Parental controls", "Durable design"],
      buttonText: "Buy Now",
      buttonVariant: "blue" as const,
    },
    {
      id: 5,
      image: shop5,
      imageAlt: "LEGO Creator 3-in-1 Deep Sea Creatures",
      title: "LEGO Creator 3-in-1 Deep Sea ",
      description:
        "Build a shark, squid, or anglerfish with this amazing 3-in-1 set",
      rating: 4.9,
      reviews: 124,
      currentPrice: "$49.99",
      originalPrice: "$49.99",
      tags: ["230 pieces", "3 models in 1", "Ages 7+ case"],
      buttonText: "Buy Now",
      buttonVariant: "blue" as const,
    },
    {
      id: 6,
      image: shop6,
      imageAlt: "Princess Jewellery Making Kit",
      title: "Princess Jewellery Making Kit",
      description:
        "Build a shark, squid, or anglerfish with this amazing 3-in-1 set",
      rating: 4.9,
      reviews: 124,
      currentPrice: "$49.99",
      originalPrice: "$49.99",
      tags: ["200+ beads", "Elastic string", "Storage case"],
      buttonText: "Buy Now",
      buttonVariant: "blue" as const,
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
      description: "Set up an obstacle course with our provided materials",
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
                  className="shadow-card hover:shadow-card-hover rounded-xl border border-[#DFE1E6] bg-white p-6 transition-all duration-200"
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
            <div className="rounded-2xl bg-[#DFE1E6] p-6">
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
    <div className="pb-20">
      <div
        className="relative -z-1 mt-10 h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      ></div>
      <div className="mx-auto -mt-72 max-w-7xl">
        <div className="overflow-hidden rounded-2xl p-4">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Product Images */}
            <div className="lg:w-1/2">
              <div className="mb-4 h-[60vh] w-auto">
                <img
                  src={activity?.image}
                  alt="Superhero Adventure Box with figurines"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>

              {/* Thumbnail images */}
              <div className="flex gap-3">
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={activity?.image}
                    alt="Thumbnail 1"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={activity?.image}
                    alt="Thumbnail 2"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-200">
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
              <h3 className="font-fredoka mb-2 text-lg font-semibold text-[#191919] md:text-3xl">
                {activity?.title}
              </h3>

              {/* Product Description */}
              <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
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
                <span className="rounded bg-[#FF5630] px-3 py-1 text-sm font-bold text-white">
                  SAVE $20
                </span>
              </div>

              {/* Price */}
              <div className="mt-8 mb-12">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#223B7D] md:text-5xl">
                    ${activity?.price}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ${activity?.originalPrice}
                  </span>
                </div>
              </div>

              {/* Shop Now Button */}
              <button className="w-full cursor-pointer rounded-lg bg-[#223B7D] px-8 py-4 font-semibold text-white transition-colors duration-200 hover:bg-blue-700">
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
          <div className="mt-10 bg-white">{renderContent()}</div>
        </div>
      </div>
      {/* here add Love (this theme?) section */}
    </div>
  );
}

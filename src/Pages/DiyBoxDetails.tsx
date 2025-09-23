import { useParams } from "react-router-dom";
import { CircleCheckBig, Play } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useEffect, useState } from "react";

import PremiumBanner from "@/components/Home/PremiumBanner";
import MyHeader from "@/components/MyHeader/MyHeader";
import { useGetDIYProductByIdQuery } from "@/redux/features/diyProducts/diyProductsApi";

export default function DiyBoxDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetDIYProductByIdQuery(id!);

  // Scroll to top when ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  // Render stars
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

  // Handle loading and error states
  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error || !data)
    return <div className="text-center py-10">Something went wrong.</div>;

  const product = data;

  // Tab content
  const renderContent = () => {
    switch (activeTab) {
      case "whats-included":
        return (
          <div className="rounded-xl border border-[#DFE1E6] bg-white p-8">
            <h2 className="mb-8 text-2xl text-gray-900">
              Everything You Need for an Amazing Party
            </h2>
            <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
              {product.included?.map((item: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <CircleCheckBig className="text-[#22C55E]" />
                  <span className="leading-relaxed text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "activities":
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {product.activities?.map((item) => (
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
                </div>
              </div>
            ))}
          </div>
        );
      case "tutorial":
        return product.tutorial ? (
          <div className="py-10">
            <div className="rounded-2xl bg-[#DFE1E6]/60 p-6 text-center">
              <Play className="mx-auto h-12 w-12 text-[#223B7D]" />
              <h2 className="mt-4 mb-2 text-xl font-medium sm:text-2xl">
                Tutorial Video
              </h2>
              <p className="text-base sm:text-lg">Watch how to use this box</p>
              <a
                href={product.tutorial}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#223B7D] px-6 py-3 text-white hover:bg-blue-800"
              >
                <Play /> Watch Tutorial
              </a>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            No tutorial available
          </div>
        );
      case "reviews":
        return (
          <div className="text-center text-gray-500 py-10">
            Reviews integration coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-0 md:pb-20">
      <MyHeader
        title=" "
        subtitle="r"
        className="-z-1 text-3xl sm:text-5xl md:text-6xl"
      />
      <div className="container mx-auto -mt-84">
        <div className="overflow-hidden rounded-2xl p-4">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Product Images */}
            <div className="lg:w-1/2">
              <div className="mb-4 h-[70vh] w-auto">
                <img
                  src={product.imges?.[0]}
                  alt={product.title}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.imges?.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="h-20 w-20 overflow-hidden rounded-xl bg-gray-200"
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Product Details */}
            <div className="p-6 lg:w-1/2 lg:p-8">
              {/* Product Type + Age */}
              <div className="mb-4 flex gap-2">
                <span className="rounded-full bg-[#223B7D] px-3 py-2 text-sm text-white">
                  {product.product_type}
                </span>
                <span className="rounded-full bg-[#58C06478]/70 px-3 py-2 text-sm text-[#19AE19]">
                  {product.age_range}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-fredoka mb-2 text-xl font-semibold text-[#191919] md:text-3xl">
                {product.title}
              </h3>

              {/* Description */}
              <p className="mb-4 w-[80%] text-lg text-[#5A5C5F]">
                {product.description}
              </p>

              {/* Rating */}
              <div className="mb-4 flex items-center gap-4 text-xl">
                <div className="flex items-center">
                  {renderStars(product.avg_rating ?? 0)}
                </div>
                <span className="font-semibold text-gray-900">
                  {product.avg_rating}
                </span>
                <span className="text-gray-500">
                  ({product.total_review} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-8 mb-6 md:mb-12">
                <span className="text-3xl font-bold text-[#223B7D] md:text-5xl">
                  ${product.price}
                </span>
              </div>

              {/* Shop Now */}
              <button className="hover:bg-secondary-light w-full cursor-pointer rounded-lg bg-[#223B7D] px-8 py-4 font-semibold text-white transition-colors duration-200">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto mt-10 max-w-7xl px-4">
        <div className="overflow-hidden rounded-lg p-4">
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

          <div className="mt-10 mb-18 bg-white">{renderContent()}</div>
        </div>
      </div>

      {/* Premium Banner */}
      <PremiumBanner />
    </div>
  );
}

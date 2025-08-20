/* eslint-disable @typescript-eslint/no-explicit-any */
// import bannerImg from "@/assets/party-banner-bg.png";
import { BookmarkIcon, ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import img1 from "@/assets/shop-1.jpg";
import img2 from "@/assets/shop-2.jpg";
import img3 from "@/assets/shop-3.jpg";
import shopIcon from "@/assets/shop-icon.png";
import shop1 from "@/assets/shop-1.jpg";
import shop2 from "@/assets/shop-2.jpg";
import shop3 from "@/assets/shop-3.jpg";
import shop4 from "@/assets/shop-4.jpg";
import shop5 from "@/assets/shop-5.jpg";
import shop6 from "@/assets/shop-6.jpg";
import printBrash from "@/assets/printBrash.png";
import shopingTrolly from "@/assets/shopping-cart.png";
import CustomizeTshirtModal from "@/components/shop/CustomizeTshirtModal";
import MyHeader from "@/components/MyHeader/MyHeader";

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [theme, setTheme] = useState("");

  // Simulate a search or filter action whenever parameters change
  useEffect(() => {
    console.log("Current Search Parameters:", {
      searchTerm,
      ageRange,
      theme,
    });
    // In a real application, you would trigger data fetching here
    // e.g., fetchData({ searchTerm, ageRange, theme });
  }, [searchTerm, ageRange, theme]);
  //   this is for modul
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const navigate = useNavigate();

  const handleButtonClick = (item: any) => {
    if (item?.buttonText === "Customize T-Shirt") {
      setSelectedProduct(item);
      setOpenModal(true);
    } else {
      navigate(`/home/diyboxe/details/${item.id}`);
    }
  };
  // fack data for  shop producr
  const products = [
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

  const getButtonClasses = (buttonVariant: string) =>
    buttonVariant === "orange"
      ? "bg-[#FFAB00] hover:bg-orange-600 text-white"
      : "bg-[#223B7D] hover:bg-blue-500 text-white";

  return (
    <div className="px-4">
      <MyHeader
        title="Gift Shop"
        subtitle="Discover the perfect gifts with AI-powered recommendations"
      />
      {/* body content here  */}
      {/* first part  */}
      <div>
        <div className="mx-auto max-w-7xl rounded-xl bg-[#BBDEFB] p-4 md:p-6">
          <div className="mb-6 flex items-center gap-2 text-[#223B7D]">
            {/* <Sparkles className="h-5 w-5 " /> */}
            <img src={shopIcon} alt="shop-con" className="h-7 w-7" />
            <h2 className="text-2xl font-bold">Invitation Preview Dans shop</h2>
          </div>
          {/* remove this part and map it when come data from api */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product Card 1 */}
            <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
              <div className="rounded-lg bg-[#FFF7ED]">
                <img
                  src={img1}
                  alt="Personalized Birthday T-Shirt"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-800">
                    Personalized Birthday T-Shirt
                  </h3>
                  <div className="mt-6 mb-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#223B7D]">
                      {" $12.9"}
                    </span>
                    <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
                      AI Pick
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
              <div className="rounded-lg bg-[#FFF7ED]">
                <img
                  src={img2}
                  alt="Personalized Birthday T-Shirt"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-800">
                    LEGO Creator 3-in-1 Deep Sea
                  </h3>
                  <div className="mt-6 mb-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#223B7D]">
                      {" $49.99"}
                    </span>
                    <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
                      AI Pick
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
              <div className="rounded-lg bg-[#FFF7ED]">
                <img
                  src={img3}
                  alt="Personalized Birthday T-Shirt"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-800">
                    Superhero Cape & Mask Set
                  </h3>
                  <div className="mt-6 mb-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#223B7D]">
                      {" $49.99"}
                    </span>
                    <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
                      AI Pick
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* search and filter part  */}
      <div className="mt-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 rounded-xl bg-white p-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative w-full flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search themes, activities, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
              aria-label="Search themes, activities, or keywords"
            />
          </div>

          <div className="relative w-full sm:w-[140px]">
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
              aria-label="Select age range"
            >
              <option value="" disabled hidden>
                Age Range
              </option>
              <option value="all">All Ages</option>
              <option value="0-5">0-5</option>
              <option value="6-12">6-12</option>
              <option value="13-18">13-18</option>
              <option value="18+">18+</option>
            </select>
            {/* Use ChevronDown icon for select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div className="relative w-full sm:w-[120px]">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
              aria-label="Select theme"
            >
              <option value="" disabled hidden>
                Theme
              </option>
              <option value="all">All Themes</option>
              <option value="adventure">Adventure</option>
              <option value="education">Education</option>
              <option value="creative">Creative</option>
              <option value="sports">Sports</option>
            </select>
            {/* Use ChevronDown icon for select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      {/* card sections  */}
      <div className="mx-auto max-w-7xl">
        <div className="mt-20 grid grid-cols-1 gap-6 pb-14 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <div
              key={item.id}
              className={`flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md ${item?.buttonText === "Customize T-Shirt" ? "border-2 border-[#223B7D]" : ""}`}
            >
              {/* Image and Tag */}
              <div className="relative h-64 w-auto">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <button className="absolute top-3 right-3 cursor-pointer rounded-sm bg-white p-2 shadow-sm hover:bg-gray-50">
                  <BookmarkIcon />
                </button>
              </div>

              {/* Content - flexible column layout */}
              <div className="flex flex-grow flex-col p-6">
                {/* Top Content */}
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-[#191919]">
                    {item.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(item.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Tags */}
                  {item?.tags && item?.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item?.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-normal text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price and Age Tag */}
                  <div className="mt-3 mb-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-gray-900">
                        {item?.currentPrice}
                      </span>
                      {item?.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {item?.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#58C0644D] px-3 py-1 text-xs font-normal text-[#19AE19]">
                      Ages 4-8 years
                    </span>
                  </div>
                </div>

                {/* Button at the bottom */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleButtonClick(item)}
                    className={`hover:bg-secondary-light flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${getButtonClasses(
                      item.buttonVariant || "blue",
                    )}`}
                  >
                    {item?.buttonText === "Customize T-Shirt" ? (
                      <span>
                        <img src={printBrash} alt="" />
                      </span>
                    ) : (
                      <span>
                        <img src={shopingTrolly} alt="" />
                      </span>
                    )}
                    {item?.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Separate Modal Component */}
          {openModal && selectedProduct && (
            <CustomizeTshirtModal
              product={selectedProduct}
              onClose={() => setOpenModal(false)}
            />
          )}
        </div>
        <div className="mb-20 flex justify-center md:justify-end">
          <button className="rounded-lg border border-[#223B7D] px-6 py-3 text-[#223B7D]">
            View all
          </button>
        </div>
      </div>
      <div>{/* shop cart here  */}</div>
      {/* shop cart end here  */}
    </div>
  );
}

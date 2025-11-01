import { ChevronDown, Search } from "lucide-react";
import { useState, type JSX } from "react";
import MyHeader from "@/components/MyHeader/MyHeader";
import { useGetAffiliateProductsQuery } from "@/redux/features/affiliatedProduct/affiliateProductApi";
import type { IAffiliatedProduct } from "@/redux/types/IAffiliatedProduct.type";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Shop(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [company, setCompany] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [ageRange, setAgeRange] = useState(""); // ✅ Added age range filter
  const [visibleCount, setVisibleCount] = useState(9);
  const loadMoreCount = 6;

  // ✅ Fetch products
  const { data, isLoading, isError } = useGetAffiliateProductsQuery({
    search: searchTerm,
    company,
    limit: 1000000,
  });

  const products: IAffiliatedProduct[] = data?.items ?? [];

  // ✅ Event handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setVisibleCount(9);
  };
  const handleCompanyChange = (value: string) => {
    setCompany(value);
    setVisibleCount(9);
  };
  const handlePriceChange = (value: string) => {
    setPriceRange(value);
    setVisibleCount(9);
  };
  const handleSortChange = (value: string) => {
    setSortOption(value);
    setVisibleCount(9);
  };
  const handleAgeChange = (value: string) => {
    setAgeRange(value);
    setVisibleCount(9);
  };

  // ✅ Render rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++)
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    if (hasHalfStar)
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    for (let i = 0; i < emptyStars; i++)
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    return stars;
  };

  // ✅ Unique filter options
  const companies = Array.from(
    new Set(products.map((p) => p.affiliated_company).filter(Boolean)),
  );
  const ageRanges = Array.from(
    new Set(products.map((p) => p.age_range).filter(Boolean)),
  );

  // ✅ Filtering logic
  const filteredProducts = products.filter((p) => {
    const matchesCompany = !company || p.affiliated_company === company;
    const matchesSearch =
      !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = !ageRange || p.age_range === ageRange;

    let matchesPrice = true;
    if (priceRange === "low") matchesPrice = p.price < 20;
    else if (priceRange === "mid")
      matchesPrice = p.price >= 20 && p.price <= 50;
    else if (priceRange === "high") matchesPrice = p.price > 50;

    return matchesCompany && matchesSearch && matchesPrice && matchesAge;
  });

  // ✅ Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceLowHigh") return a.price - b.price;
    if (sortOption === "priceHighLow") return b.price - a.price;
    if (sortOption === "ratingHighLow") return b.avg_rating - a.avg_rating;
    if (sortOption === "newest") {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    return 0;
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="px-4">
      <MyHeader
        title="Affiliated Shop"
        subtitle="Discover the perfect gifts with AI-powered recommendations"
      />

      {/* ✅ Filter Section */}
      <section className="mt-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:justify-between sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative w-full flex-1 sm:w-[220px]">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search products or keywords..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            />
          </div>

          {/* Company Filter */}
          <div className="relative w-full sm:w-[180px]">
            <select
              value={company}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          </div>

          {/* Age Range Filter ✅ */}
          <div className="relative w-full sm:w-[180px]">
            <select
              value={ageRange}
              onChange={(e) => handleAgeChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            >
              <option value="">All Age Ranges</option>
              {ageRanges.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          </div>

          {/* Price Filter */}
          <div className="relative w-full sm:w-[180px]">
            <select
              value={priceRange}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            >
              <option value="">All Prices</option>
              <option value="low">Under €20</option>
              <option value="mid">€20 - €50</option>
              <option value="high">Above €50</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          </div>

          {/* Sort Filter */}
          <div className="relative w-full sm:w-[180px]">
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            >
              <option value="">Sort By</option>
              <option value="newest">Newest</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="ratingHighLow">Top Rated</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          </div>
        </div>
      </section>

      {/* ✅ Product Grid */}
      <section className="mx-auto mt-10 max-w-7xl">
        {isLoading && (
          <p className="text-center text-gray-500">Loading products...</p>
        )}
        {isError && (
          <p className="text-center text-red-500">Failed to load products.</p>
        )}
        {!isLoading && !isError && displayedProducts.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        {!isLoading && !isError && displayedProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 pb-14 md:grid-cols-2 lg:grid-cols-3">
            {displayedProducts.map((product) => (
              <article
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => window.open(product.link, "_blank")}
                className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-[#FFFAF5] shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-[#223B7D] px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {product.affiliated_company || "GIFT"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-grow flex-col p-6">
                  <h3 className="mb-2 text-xl font-semibold text-[#191919]">
                    {product.title.length > 60
                      ? `${product.title.slice(0, 60)}...`
                      : product.title}
                  </h3>
                  <div className="mb-2 text-lg font-semibold">
                    €{product.price.toLocaleString()}
                  </div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(product.avg_rating || 0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {product.avg_rating?.toFixed(1) ?? "0.0"}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({product.total_review ?? 0} reviews)
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(product.link, "_blank");
                    }}
                    className="mt-auto w-full cursor-pointer rounded-xl border bg-[#223B7D] px-4 py-3 text-gray-50 transition-colors hover:bg-blue-900"
                  >
                    Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More */}
        {visibleCount < sortedProducts.length && (
          <div className="flex justify-end">
            <button
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(prev + loadMoreCount, sortedProducts.length),
                )
              }
              className="cursor-pointer rounded-lg bg-[#223B7D] px-6 py-3 text-white transition-colors hover:bg-[#07194b]"
            >
              View More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// import { ChevronDown, Search } from "lucide-react";
// import { useState, type JSX } from "react";
// import MyHeader from "@/components/MyHeader/MyHeader";
// import { useGetAffiliateProductsQuery } from "@/redux/features/affiliatedProduct/affiliateProductApi";
// import type { IAffiliatedProduct } from "@/redux/types/IAffiliatedProduct.type";
// import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

// export default function Shop(): JSX.Element {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [company, setCompany] = useState("");
//   const [priceRange, setPriceRange] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [visibleCount, setVisibleCount] = useState(9);
//   const loadMoreCount = 6;

//   // ✅ Fetch products
//   const { data, isLoading, isError } = useGetAffiliateProductsQuery({
//     search: searchTerm,
//     company,
//     limit: 1000000,
//   });

//   const products: IAffiliatedProduct[] = data?.items ?? [];

//   // ✅ Event handlers
//   const handleSearchChange = (value: string) => {
//     setSearchTerm(value);
//     setVisibleCount(9);
//   };
//   const handleCompanyChange = (value: string) => {
//     setCompany(value);
//     setVisibleCount(9);
//   };
//   const handlePriceChange = (value: string) => {
//     setPriceRange(value);
//     setVisibleCount(9);
//   };
//   const handleSortChange = (value: string) => {
//     setSortOption(value);
//     setVisibleCount(9);
//   };

//   // ✅ Render rating stars
//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     for (let i = 0; i < fullStars; i++)
//       stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
//     if (hasHalfStar)
//       stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
//     for (let i = 0; i < emptyStars; i++)
//       stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
//     return stars;
//   };

//   // ✅ Get unique companies
//   const companies = Array.from(
//     new Set(products.map((p) => p.affiliated_company).filter(Boolean)),
//   );

//   // ✅ Filtering logic
//   const filteredProducts = products.filter((p) => {
//     const matchesCompany = !company || p.affiliated_company === company;
//     const matchesSearch =
//       !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase());

//     let matchesPrice = true;
//     if (priceRange === "low") matchesPrice = p.price < 20;
//     else if (priceRange === "mid")
//       matchesPrice = p.price >= 20 && p.price <= 50;
//     else if (priceRange === "high") matchesPrice = p.price > 50;

//     return matchesCompany && matchesSearch && matchesPrice;
//   });

//   // ✅ Sorting logic (fixed `createdAt` issue)
//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     if (sortOption === "priceLowHigh") return a.price - b.price;
//     if (sortOption === "priceHighLow") return b.price - a.price;
//     if (sortOption === "ratingHighLow") return b.avg_rating - a.avg_rating;
//     if (sortOption === "newest") {
//       const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//       const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//       return dateB - dateA;
//     }
//     return 0;
//   });

//   const displayedProducts = sortedProducts.slice(0, visibleCount);

//   return (
//     <div className="px-4">
//       <MyHeader
//         title="Affiliated Shop"
//         subtitle="Discover the perfect gifts with AI-powered recommendations"
//       />

//       {/* ✅ Filter Section */}
//       <section className="mt-10">
//         <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:space-y-0 sm:space-x-4">
//           {/* Search */}
//           <div className="relative w-full flex-1">
//             <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search products or keywords..."
//               value={searchTerm}
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             />
//           </div>

//           {/* Company Filter */}
//           <div className="relative w-full sm:w-[180px]">
//             <select
//               value={company}
//               onChange={(e) => handleCompanyChange(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             >
//               <option value="">All Companies</option>
//               {companies.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
//           </div>

//           {/* Price Filter */}
//           <div className="relative w-full sm:w-[180px]">
//             <select
//               value={priceRange}
//               onChange={(e) => handlePriceChange(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             >
//               <option value="">All Prices</option>
//               <option value="low">Under €20</option>
//               <option value="mid">€20 - €50</option>
//               <option value="high">Above €50</option>
//             </select>
//             <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
//           </div>

//           {/* Sort Filter */}
//           <div className="relative w-full sm:w-[180px]">
//             <select
//               value={sortOption}
//               onChange={(e) => handleSortChange(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             >
//               <option value="">Sort By</option>
//               <option value="newest">Newest</option>
//               <option value="priceLowHigh">Price: Low to High</option>
//               <option value="priceHighLow">Price: High to Low</option>
//               <option value="ratingHighLow">Top Rated</option>
//             </select>
//             <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
//           </div>
//         </div>
//       </section>

//       {/* ✅ Product Grid */}
//       <section className="mx-auto mt-10 max-w-7xl">
//         {isLoading && (
//           <p className="text-center text-gray-500">Loading products...</p>
//         )}
//         {isError && (
//           <p className="text-center text-red-500">Failed to load products.</p>
//         )}
//         {!isLoading && !isError && displayedProducts.length === 0 && (
//           <p className="text-center text-gray-500">No products found.</p>
//         )}

//         {!isLoading && !isError && displayedProducts.length > 0 && (
//           <div className="grid grid-cols-1 gap-6 pb-14 md:grid-cols-2 lg:grid-cols-3">
//             {displayedProducts.map((product) => (
//               <article
//                 key={product.id}
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => window.open(product.link, "_blank")}
//                 className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-[#FFFAF5] shadow-sm transition-shadow hover:shadow-md"
//               >
//                 <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-gray-100">
//                   <img
//                     src={product.image_url}
//                     alt={product.title}
//                     className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
//                     loading="lazy"
//                   />
//                   <div className="absolute top-3 left-3">
//                     <span className="inline-flex items-center rounded-full bg-[#223B7D] px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
//                       {product.affiliated_company || "GIFT"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex flex-grow flex-col p-6">
//                   <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                     {product.title.length > 60
//                       ? `${product.title.slice(0, 60)}...`
//                       : product.title}
//                   </h3>
//                   {/* <div className="mb-2 text-lg font-semibold">€{product.price}</div> */}
//                   <div className="mb-2 text-lg font-semibold">
//                     €{product.price.toLocaleString()}
//                   </div>
//                   <div className="mb-4 flex items-center gap-2">
//                     <div className="flex items-center">
//                       {renderStars(product.avg_rating || 0)}
//                     </div>
//                     <span className="text-sm font-medium text-gray-900">
//                       {product.avg_rating?.toFixed(1) ?? "0.0"}
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       ({product.total_review ?? 0} reviews)
//                     </span>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       window.open(product.link, "_blank");
//                     }}
//                     className="mt-auto w-full cursor-pointer rounded-xl border bg-[#223B7D] px-4 py-3 text-gray-50 transition-colors hover:bg-blue-900"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}

//         {/* Load More */}
//         {visibleCount < sortedProducts.length && (
//           <div className="flex justify-end">
//             <button
//               onClick={() =>
//                 setVisibleCount((prev) =>
//                   Math.min(prev + loadMoreCount, sortedProducts.length),
//                 )
//               }
//               className="cursor-pointer rounded-lg bg-[#223B7D] px-6 py-3 text-white transition-colors hover:bg-[#07194b]"
//             >
//               View More
//             </button>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

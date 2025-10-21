import { ChevronDown, Search } from "lucide-react";
import { useState, type JSX } from "react";
import MyHeader from "@/components/MyHeader/MyHeader";
import { useGetAffiliateProductsQuery } from "@/redux/features/affiliatedProduct/affiliateProductApi";
import type { IAffiliatedProduct } from "@/redux/types/IAffiliatedProduct.type";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Shop(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [company, setCompany] = useState("");

  // Fetch products with optional query params
  const { data, isLoading, isError } = useGetAffiliateProductsQuery({
    search: searchTerm,
    company,
  });

  // Map data safely
  const products: IAffiliatedProduct[] = data?.items ?? [];

  // Render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    return stars;
  };
const companies = Array.from(
  new Set(products.map((product) => product.affiliated_company).filter(Boolean))
);
  return (
    <div className="px-4">
      <MyHeader
        title="Gift Shop"
        subtitle="Discover the perfect gifts with AI-powered recommendations"
      />

      {/* Filters */}
      <section className="mt-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 rounded-xl bg-white p-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative w-full flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search themes, activities, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            />
          </div>

          {/* Company Filter */}
          <div className="relative w-full sm:w-[160px]">
            
<select
  value={company}
  onChange={(e) => setCompany(e.target.value)}
  className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
>
  <option value="">All Companies</option>
  {companies.map((comp) => (
    <option key={comp} value={comp}>
      {comp}
    </option>
  ))}
</select>


            <ChevronDown className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl mt-10">
        {isLoading && <p className="text-center text-gray-500">Loading products...</p>}
        {isError && <p className="text-center text-red-500">Failed to load products.</p>}

        {!isLoading && !isError && products.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 pb-14 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => window.open(product.link, "_blank")}
                className="flex h-full flex-col overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md cursor-pointer"
              >
                {/* Image & Company Badge */}
                <div className="relative h-64 overflow-hidden w-auto">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                      {product.affiliated_company || "GIFT"}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-grow flex-col p-6">
                  <h3 className="mb-2 text-xl font-semibold text-[#191919]">
                    {product.title.slice(0, 60)}...
                  </h3>


                  <div className="mb-2 font-semibold text-lg">€{product.price}</div>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center">{renderStars(product.avg_rating || 0)}</div>
                    <span className="text-sm font-medium text-gray-900">{product.avg_rating?.toFixed(1) ?? "0.0"}</span>
                    <span className="text-sm text-gray-500">({product.total_review ?? 0} reviews)</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(product.link, "_blank");
                    }}
                    className="mt-auto cursor-pointer w-full rounded-lg border bg-[#223B7D] px-4 py-3 text-gray-50 transition-colors hover:bg-blue-900"
                  >
                    Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}



// import { ChevronDown, Search } from "lucide-react";
// import { useState, type JSX } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
// import MyHeader from "@/components/MyHeader/MyHeader";
// import { useGetAffiliateProductsQuery } from "@/redux/features/affiliatedProduct/affiliateProductApi";
// import type { IAffiliatedProduct } from "@/redux/types/IAffiliatedProduct.type";
// export default function Shop(): JSX.Element {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [productType, setProductType] = useState<"" | "DIY_BOX" | "GIFT">("");
//   const [company, setCompany] = useState("");
//   const navigate = useNavigate();

//   // ✅ Fetch products with query filters
//   const { data, isLoading, isError } = useGetAffiliateProductsQuery({
//     search: searchTerm,
//     company,
//   });
//   console.log(data, "data")
//   // ✅ Safe fallback if API response isn't an array
//   // const products: IAffiliatedProduct[] = Array.isArray(data) ? data : [];
//   const products: IAffiliatedProduct[] = data?.items ?? [];
//   console.log(products, "productsfhghfghfghfghfg")
//   // ⭐ Rating renderer
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

//   return (
//     <div className="px-4">
//       <MyHeader
//         title="Gift Shop"
//         subtitle="Discover the perfect gifts with AI-powered recommendations"
//       />

//       {/* 🔹 Filters Section */}
//       <section className="mt-10">
//         <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 rounded-xl bg-white p-4 sm:flex-row sm:space-y-0 sm:space-x-4">
//           {/* Search */}
//           <div className="relative w-full flex-1">
//             <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search themes, activities, or keywords..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             />
//           </div>



//           {/* Company Filter */}
//           <div className="relative w-full sm:w-[160px]">
//             <select
//               value={company}
//               onChange={(e) => setCompany(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             >
//               <option value="">All Companies</option>
//               <option value="MakeMyMini">MakeMyMini</option>
//               <option value="HappyCrafts">HappyCrafts</option>
//               <option value="ArtifyBox">ArtifyBox</option>
//               <option value="GiftGuru">GiftGuru</option>
//             </select>
//             <ChevronDown className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700 pointer-events-none" />
//           </div>
//         </div>
//       </section>

//       {/* 🔹 Product Grid */}
//       <section className="mx-auto max-w-7xl mt-10">
//         {isLoading && (
//           <p className="text-center text-gray-500">Loading products...</p>
//         )}
//         {isError && (
//           <p className="text-center text-red-500">Failed to load products.</p>
//         )}

//         {!isLoading && !isError && (
//           <div className="grid grid-cols-1 gap-6 pb-14 md:grid-cols-2 lg:grid-cols-3">
//             {products.map((product) => (
//               <article
//                 key={product.id}
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => window.open(product.link, "_blank")}
//                 className="flex h-full flex-col overflow-hidden rounded-lg   shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//               >
//                 <div className="relative h-64 overflow-hidden w-auto">
//                   <img
//                     src={product.image_url}
//                     alt={product.title}
//                     className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
//                   />
//                   <div className="absolute top-3 left-3">
//                     <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
//                       {product.affiliated_company || "GIFT"}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex flex-grow flex-col p-6">
//                   <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                     {product.title.slice(0, 60)}.......
//                   </h3>
//                   <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                     {product.items}
//                   </p>


//                   <div>
//                     €{product.price}
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
//                   <div className="mt-auto flex gap-3">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         window.open(product.link, "_blank");
//                       }}
//                       className="cursor-pointer hover:bg-blue-900  w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                     >
//                       Buy Now
//                     </button>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}


//       </section>
//     </div>
//   );
// }























// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ChevronDown, Search } from "lucide-react";
// import { useEffect, useState, type JSX } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
// import MyHeader from "@/components/MyHeader/MyHeader";
// import img1 from "../assets/shop-1.jpg"
// import img2 from "../assets/shop-2.jpg"
// import img3 from "../assets/shop-3.jpg"
// import shopIcon from "../assets/icon4.png"
// export default function Shop(): JSX.Element {
//   // UI controls
//   const [searchTerm, setSearchTerm] = useState("");
//   const [ageRange, setAgeRange] = useState("");
//   const [theme, setTheme] = useState("");
//   const [productType, setProductType] = useState<"" | "DIY_BOX" | "GIFT">("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("Search params:", { searchTerm, ageRange, theme, productType });
//   }, [searchTerm, ageRange, theme, productType]);
//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
//     }

//     if (hasHalfStar) {
//       stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
//     }

//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
//     }

//     return stars;
//   };
//   return (
//     <div className="px-4">
//       <MyHeader
//         title="Gift Shop"
//         subtitle="Discover the perfect gifts with AI-powered recommendations"
//       />

//       <section className="mt-6">
//         <div className="mx-auto max-w-7xl rounded-xl bg-[#BBDEFB] p-4 md:p-6">
//           <div className="mb-6 flex items-center gap-2 text-[#223B7D]">
//             <img src={shopIcon} alt="shop-icon" className="h-7 w-7" />
//             <h2 className="text-2xl font-bold">Recommended for You</h2>
//           </div>

//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
//               <div className="rounded-lg bg-[#FFF7ED]">
//                 <img
//                   src={img1}
//                   alt="Personalized Birthday T-Shirt"
//                   className="h-48 w-full rounded-lg object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-xl font-medium text-gray-800">
//                     Personalized Birthday T-Shirt
//                   </h3>
//                   <div className="mt-6 mb-2 flex items-center justify-between">
//                     <span className="text-lg font-bold text-[#223B7D]">
//                       $12.90
//                     </span>
//                     <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
//                       Pick
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
//               <div className="rounded-lg bg-[#FFF7ED]">
//                 <img
//                   src={img2}
//                   alt="LEGO Creator"
//                   className="h-48 w-full rounded-lg object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-xl font-medium text-gray-800">
//                     LEGO Creator 3-in-1 Deep Sea
//                   </h3>
//                   <div className="mt-6 mb-2 flex items-center justify-between">
//                     <span className="text-lg font-bold text-[#223B7D]">
//                       $49.99
//                     </span>
//                     <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
//                       Pick
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
//               <div className="rounded-lg bg-[#FFF7ED]">
//                 <img
//                   src={img3}
//                   alt="Superhero Cape"
//                   className="h-48 w-full rounded-lg object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-xl font-medium text-gray-800">
//                     Superhero Cape & Mask Set
//                   </h3>
//                   <div className="mt-6 mb-2 flex items-center justify-between">
//                     <span className="text-lg font-bold text-[#223B7D]">
//                       $49.99
//                     </span>
//                     <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
//                       Pick
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="mt-10">
//         <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 rounded-xl bg-white p-4 sm:flex-row sm:space-y-0 sm:space-x-4">
//           <div className="relative w-full flex-1">
//             <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search themes, activities, or keywords..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               aria-label="Search themes, activities, or keywords"
//             />
//           </div>

//           {/* Product Type Filter */}
//           <div className="relative w-full sm:w-[140px]">
//             <select
//               value={productType}
//               onChange={(e) => setProductType(e.target.value as "" | "DIY_BOX" | "GIFT")}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               aria-label="Select product type"
//             >
//               <option value="">All Products</option>
//               <option value="DIY_BOX">DIY Boxes</option>
//               <option value="GIFT">Gifts</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <ChevronDown className="h-4 w-4" />
//             </div>
//           </div>

//           <div className="relative w-full sm:w-[140px]">
//             <select
//               value={ageRange}
//               onChange={(e) => setAgeRange(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               aria-label="Select age range"
//             >
//               <option value="">Age Range</option>
//               <option value="all">All Ages</option>
//               <option value="3-6">3-6 years</option>
//               <option value="5+">5+ years</option>
//               <option value="6-10">6-10 years</option>
//               <option value="8-12">8-12 years</option>
//               <option value="9-12">9-12 years</option>
//               <option value="10+">10+ years</option>
//               <option value="13+">13+ years</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <ChevronDown className="h-4 w-4" />
//             </div>
//           </div>

//           <div className="relative w-full sm:w-[120px]">
//             <select
//               value={theme}
//               onChange={(e) => setTheme(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               aria-label="Select theme"
//             >
//               <option value="">Theme</option>
//               <option value="all">All Themes</option>
//               <option value="SUPERHERO">Superhero</option>
//               <option value="adventure">Adventure</option>
//               <option value="education">Education</option>
//               <option value="creative">Creative</option>
//               <option value="sports">Sports</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <ChevronDown className="h-4 w-4" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ---------- Products Grid ---------- */}
//       <section className="mx-auto max-w-7xl">
//         <div className="mt-20 grid grid-cols-1 gap-6 pb-14 md:grid-cols-2 lg:grid-cols-3">
//           <article
//             role="button"
//             tabIndex={0}
//             onClick={() => window.location.href = "https://amzn.to/3KHm6Ye"}
//             className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//           >
//             <div className="relative h-64 w-auto">
//               <img
//                 src="https://i.ibb.co.com/1JG8MQMH/81v-YYe-K13-L-AC-SY550.jpg"
//                 alt="Image"
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute top-3 left-3">
//                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                   GIFT
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-grow flex-col p-6">
//               <h3 className="mb-2 text-2xl font-semibold text-[#191919]">
//                 Shuffle – Gabby et la Maison Magique
//               </h3>
//               <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                 À propos de cet article
//                 Découvrez Gabby et tous ses amis dans ce jeu de familles inédit ! 4 jeux disponibles dans une seule et même boîte !
//                 Découvrez 4 règles de jeux différentes pour seulement 1 jeu de cartes : jeu de 7 familles, jeu de paires, jeu d'action et jeu de batailles !
//                 Des vidéos explicatives sont disponibles en ligne, et ce dans 14 langues différentes.
//                 Contient 33 cartes et les règles des jeux
//                 À partir de 4 ans, de 2 à 10 joueurs : idéal pour jouer en famille ou entre amis
//               </p>
//               <div className="mb-4 flex items-center gap-2">
//                 <div className="flex items-center">{renderStars(4.6)}</div>
//                 <span className="text-sm font-medium text-gray-900">4.6</span>
//                 <span className="text-sm text-gray-500">(148 reviews)</span>
//               </div>
//               <div className="mt-auto flex gap-3">
//                 <button
//                   onClick={() => window.location.href = "https://amzn.to/3KHm6Ye"}
//                   className="cursor-pointer hover:bg-blue-900 w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </article>
//           <article
//             role="button"
//             tabIndex={0}
//             onClick={() => window.location.href = "https://amzn.to/48pBouy"}
//             className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//           >
//             <div className="relative h-64 w-auto">
//               <img
//                 src="https://i.ibb.co.com/Dg44V4Ht/61h-CBp-QZji-L-SX522.jpg"
//                 alt="Image"
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute top-3 left-3">
//                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                   GIFT
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-grow flex-col p-6">
//               <h3 className="mb-2 text-2xl font-semibold text-[#191919]">
//                 Kzouenzu Happy Birthday Banner (Gold)
//               </h3>
//               <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                 [Elegant Design] - The happy birthday garland banner is hollowed out and gold design, which adds sparkle to celebrations. Simple and elegant banner for birthday party decorations, happy birthday decorations.
//                 [High quality] - Our banners are made of high quality paper, strong, durable.
//                 [Quality] - Reusable, this beautiful gold glitter garland will easily fit into any home. With its high-quality lettering, you can decorate your room in a blink of an eye. Perfect for a party and for taking beautiful pictures!
//                 [Occasion] - You can hang them from the ceiling, above the table, under the veranda or on the branches of trees. Enjoy the party..... these birthday party decorations are perfect for all ages!
//                 [Wide range of uses] - The handmade glitter banner with letters "Happy Birthday" is in a fashionable style and very beautiful. The garland can be perfectly combined with other decorations and beautiful decorative accents in your rooms. You can hang it anywhere, wall, branch, etc. This adds a cheerful atmosphere.
//               </p>
//               <div className="mb-4 flex items-center gap-2">
//                 <div className="flex items-center">{renderStars(4.9)}</div>
//                 <span className="text-sm font-medium text-gray-900">4.9</span>
//                 <span className="text-sm text-gray-500">(33 reviews)</span>
//               </div>
//               <div className="mt-auto flex gap-3">
//                 <button
//                   onClick={() => window.location.href = "https://amzn.to/48pBouy"}
//                   className="cursor-pointer hover:bg-blue-900 w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </article>
//           <article
//             role="button"
//             tabIndex={0}
//             onClick={() => window.location.href = "https://amzn.to/3VVLJa7"}
//             className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//           >
//             <div className="relative h-64 w-auto">
//               <img
//                 src="https://i.ibb.co.com/Bxhqqvr/71-VKby-QOdq-L-AC-SX425.jpg"
//                 alt="Image"
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute top-3 left-3">
//                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                   GIFT
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-grow flex-col p-6">
//               <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                 JOIYHY 26 x Birthday Cake Decoration (Gold)
//               </h3>
//               <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                 Package includes: You will receive 24 butterflies cake toppers and 2 happy birthday toppers. They can be combined with different styles of cakes to make their cakes more attractive.
//                 【Safety material】 The butterfly cake topper is made of high quality paper, high strength, without deformation, comfortable to use. Cake topper is made of acrylic material, not easy to break and reusable.
//                 【DIY creation】 Decoración para tartas de cumpleaños can make your cake DIY, stimulate imagination and creativity in the process of making your own cake, make your cake more meaningful, Decoracion para tartas de cumpleaños can add a little fantasy to the cake for this special occasion.
//                 【Easy to use】The butterfly cake topper is very easy to use, you can put the butterfly directly on the cake, or you can use a stick to put the butterfly on the cake, all the pieces are cut precisely. You can even stick the butterfly to the wall as a wall decoration or staging.
//                 【Versatile Use】 It can be used as a delicate accessory for cakes, cupcakes, ice cream, cheese, fruit or any other dish you want to decorate, perfect for birthday parties, baby showers, parties or other events.
//               </p>
//               <div className="mb-4 flex items-center gap-2">
//                 <div className="flex items-center">{renderStars(4.4)}</div>
//                 <span className="text-sm font-medium text-gray-900">4.4</span>
//                 <span className="text-sm text-gray-500">(4 reviews)</span>
//               </div>
//               <div className="mt-auto flex gap-3">
//                 <button
//                   onClick={() => window.location.href = "https://amzn.to/3VVLJa7"}
//                   className="cursor-pointer hover:bg-blue-900 w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </article>
//           <article
//             role="button"
//             tabIndex={0}
//             onClick={() => window.location.href = "https://amzn.to/47i2xOO"}
//             className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//           >
//             <div className="relative h-64 w-auto">
//               <img
//                 src="https://i.ibb.co.com/KRKPhR0/61vv-Zqc-Mu-XL-AC-SX679.jpg"
//                 alt="Image"
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute top-3 left-3">
//                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                   GIFT
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-grow flex-col p-6">
//               <h3 className="mb-2 text-2xl font-semibold text-[#191919]">
//                 Unicorn Girl Birthday Decoration
//               </h3>
//               <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                 Our unicorn birthday decoration kit includes a unicorn garland "Happy Birthday" and 10 spiral hangers, for effortless fairy girl birthday decoration.
//                 Unicorn Fairy Design for Girls: The brightly colored unicorn, stars and rainbow patterns create a magical atmosphere, perfect for a girl's unicorn birthday or children's party.
//                 ❃【Safe & Reusable Materials】Made of quality paper and plastic, our unicorn girl birthday decoration is non-toxic, lightweight and reusable - ideal for long-lasting parties.
//                 Easy installation without tools: the unicorn garland and spiral hanging lights can be easily attached without tools, glue or tape - perfect for walls, windows, ceilings or trees.
//                 【Versatile Use for Any Occasion】Suitable for unicorn birthday, baby shower, carnival, children's party decoration, christening or unicorn theme - a magical decoration for any moment.
//               </p>
//               <div className="mb-4 flex items-center gap-2">
//                 <span className="text-sm text-gray-500">(0 reviews)</span>
//               </div>
//               <div className="mt-auto flex gap-3">
//                 <button
//                   onClick={() => window.location.href = "https://amzn.to/47i2xOO"}
//                   className="cursor-pointer hover:bg-blue-900 w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </article>
//           <article
//             role="button"
//             tabIndex={0}
//             onClick={() => window.location.href = "https://amzn.to/3Wy6xEK"}
//             className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//           >
//             <div className="relative h-64 w-auto">
//               <img
//                 src="https://i.ibb.co.com/95Fzybb/41-M-M3hf-Fo-L-AC.jpg"
//                 alt="Image"
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute top-3 left-3">
//                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                   GIFT
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-grow flex-col p-6">
//               <h3 className="mb-2 text-2xl font-semibold text-[#191919]">
//                 Unicorn Cake Decoration
//               </h3>
//               <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                 The unicorn cupcake topper set is made of card paper, which is strong and does not fade on food.We provide wooden sticks, paper straws and glue dots for you to decorate the birthday cakes as you like.
//                 You will get 1 cute unicorn cake topper set, including 1 unicorn horn, 1 happy birthday banner, 2 ears, 2 eyes, 2 blushers and 3 flowers and 3 paper straws and A little glue is very suitable for decorating children's birthday cakes.
//                 These party hats and accessories are designed with unicorn elements.Cute shapes and beautiful colors are children's favorites, and they are very suitable for unicorn theme party decorations. Add unique colors to your big parties.
//                 The unicorn cake top hat is the perfect size. It is very suitable for 8 to 9 inch cakes and you can adjust the insertion depth of the pins to make the height of the cake lid different.
//                 Very suitable for children's birthday party, wedding party, unicorn theme party decoration, will attract the interest of children and adults.
//               </p>
//               <div className="mb-4 flex items-center gap-2">
//                 <div className="flex items-center">{renderStars(4.1)}</div>
//                 <span className="text-sm font-medium text-gray-900">4.1</span>
//                 <span className="text-sm text-gray-500">(44 reviews)</span>
//               </div>
//               <div className="mt-auto flex gap-3">
//                 <button
//                   onClick={() => window.location.href = "https://amzn.to/3Wy6xEK"}
//                   className="cursor-pointer hover:bg-blue-900 w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </article>
//           <article
//             role="button"
//             tabIndex={0}
//             onClick={() => window.location.href = "https://amzn.to/4mXtXyg"}
//             className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//           >
//             <div className="relative h-64 w-auto">
//               <img
//                 src="https://i.ibb.co.com/6JPtWtC2/71-Z0dn-Rjtq-L-AC-SX425.jpg"
//                 alt="Image"
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute top-3 left-3">
//                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                   GIFT
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-grow flex-col p-6">
//               <h3 className="mb-2 text-2xl font-semibold text-[#191919]">
//                 Baby Teething Ball
//               </h3>
//               <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                 [Baby Teether]: It is made of food grade silicone & ABS with 12 soft chewing points and 2 different textured surfaces, intended to relieve the pain of teething babies in oral step. It also promotes chewing and biting movements of the baby.
//                 [ Sensory baby toy 6 months: More than just a teether, it is also a sensory baby game 0-3 months babies. It makes a rattle sound when twisted or shaken, thus attracting the attention of newborns, in addition to the bright colors that help with visual stimulation and color learning.
//                 [ For small hands]: Our Montessori baby toy 0-6 months is lightweight and perfect size to encourage little hands to reach and grasp. The baby can play with it in the crib, stroller, car, plane, etc.
//                 [ Newborn baby girl boy gift 6-12 months]: No small detachable parts, babies can play with this toy freely and safely without parental supervision. Suitable for newborns 0 months and up.
//                 [Easy to clean]: It must be fully cleaned before first use. Made of heat-resistant materials, it can be cleaned by ultraviolet light, steam
//                 [Product Size]: 10.5*10.5*7cm, Product weight: 110g
//               </p>
//               <div className="mb-4 flex items-center gap-2">
//                 <div className="flex items-center">{renderStars(4.6)}</div>
//                 <span className="text-sm font-medium text-gray-900">4.6</span>
//                 <span className="text-sm text-gray-500">(1735 reviews)</span>
//               </div>
//               <div className="mt-auto flex gap-3">
//                 <button
//                   onClick={() => window.location.href = "https://amzn.to/4mXtXyg"}
//                   className="cursor-pointer hover:bg-blue-900 w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </article>
//           <article
//             role="button"
//             tabIndex={0}
//             onClick={() => window.location.href = "https://amzn.to/3IYedx1"}
//             className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//           >
//             <div className="relative h-64 w-auto">
//               <img
//                 src="https://i.ibb.co.com/d0dZKJR9/71v6e-Al-Jus-S-AC-SX679-PIbundle-28-Top-Right-0-0-SH20.jpg"
//                 alt="Image"
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute top-3 left-3">
//                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                   GIFT
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-grow flex-col p-6">
//               <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                 Ravensburger - Educational Game
//               </h3>
//               <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                 The domino is a classic for ages 3 and up. The principle of image association allows the child to develop his ability to observe and think. This game with simple rules unites generations and allows you to enjoy the pleasure of being together: the happiness of playing far from the screens!
//                 Who will put the most dominoes in a row? Will you be able to assemble all the characters of the Paw Patrol? In this little "paw patrol" domino you will find beautiful illustrations that delight young and old. Each card hides an iconic PAW Patrol character: Chase, Ruben, Marcus, Stella, Rocky and Zuma.
//                 Simple rules. Mix the dominoes face down. The first player puts one of his dominoes. The next player looks at his dominoes, if he has one of the two images that matches the first player's card, he puts it in a row. The goal of the game is to get rid of all of your dominoes to win!
//                 Contents: 28 dominoes on the Paw Patrol universe. This product consists of materials from well-managed FSC-certified forests, recycled materials and materials from other controlled sources (FSC-C111262). This product was made in Europe."
//                 All our small domino memory lotto are present to accompany your child in educational entertainment. Your child can challenge their memory with themes such as: pets and baby animals. And can find these favorite heroes with the characters of Frozen Little Brown Bear, Peppa Pig and T'choupi.
//               </p>
//               <div className="mb-4 flex items-center gap-2">
//                 <div className="flex items-center">{renderStars(4.7)}</div>
//                 <span className="text-sm font-medium text-gray-900">4.7</span>
//                 <span className="text-sm text-gray-500">(1076 reviews)</span>
//               </div>
//               <div className="mt-auto flex gap-3">
//                 <button
//                   onClick={() => window.location.href = "https://amzn.to/3IYedx1"}
//                   className="cursor-pointer hover:bg-blue-900 w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                 >
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </article>
//         </div>


//         <div className="mb-20 flex justify-center md:justify-end">
//           <button
//             onClick={() => navigate("/shop")}
//             className="rounded-lg border border-[#223B7D] px-6 py-3 text-[#223B7D] hover:bg-gray-50 transition-colors"
//           >
//             View all
//           </button>
//         </div>
//       </section>


//     </div>
//   );
// }









































// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ChevronDown, Search, Heart as HeartIcon } from "lucide-react";
// import { useEffect, useState, type JSX } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

// import img1 from "@/assets/shop-1.jpg";
// import img2 from "@/assets/shop-2.jpg";
// import img3 from "@/assets/shop-3.jpg";
// import shopIcon from "@/assets/shop-icon.png";
// import printBrash from "@/assets/printBrash.png";
// import shopingTrolly from "@/assets/shopping-cart.png";

// import CustomizeTshirtModal from "@/components/shop/CustomizeTshirtModal";
// import MyHeader from "@/components/MyHeader/MyHeader";

// import toast from "react-hot-toast";

// // Redux imports
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import { addToCart } from "@/redux/features/cart/cartSlice";

// // Updated RTK Query hooks for new API structure
// import { useGetAllProductsFlatQuery } from "@/redux/features/diyProducts/diyProductsApi";
// import type { DIYProduct } from "@/redux/types/diy.types";
// import { useAddToWishlistApiMutation, useRemoveFromWishlistApiMutation } from "@/redux/features/wishlist/wishlistApi";

// export default function Shop(): JSX.Element {
//   // UI controls
//   const [searchTerm, setSearchTerm] = useState("");
//   const [ageRange, setAgeRange] = useState("");
//   const [theme, setTheme] = useState("");
//   const [productType, setProductType] = useState<"" | "DIY_BOX" | "GIFT">("");

//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   // Redux state
//   const wishlist = useAppSelector((state: any) => state.wishlist?.items ?? []);
//   const cart = useAppSelector((state: any) => state.cart?.items ?? []);

//   // API mutations
//   const [addToWishlistApi] = useAddToWishlistApiMutation();
//   const [removeFromWishlistApi] = useRemoveFromWishlistApiMutation();

//   // Modal state
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedDIYProduct, setSelectedDIYProduct] = useState<DIYProduct | null>(null);

//   // Loading states for individual items
//   const [wishlistLoadingStates, setWishlistLoadingStates] = useState<{ [key: string]: boolean }>({});

//   // Updated: Use the new API hook that returns flattened array
//   const { data: diyProducts = [], isLoading, isError } = useGetAllProductsFlatQuery();

//   // Debug: log search params
//   useEffect(() => {
//     console.log("Search params:", { searchTerm, ageRange, theme, productType });
//   }, [searchTerm, ageRange, theme, productType]);

//   // ---------- Helpers & transformers ----------

//   type CardItem = {
//     id: string;
//     image: string;
//     imageAlt: string;
//     title: string;
//     description: string;
//     rating: number;
//     reviews: number;
//     price: number;
//     currentPrice: number;
//     discountedPrice?: number;
//     tags: string[];
//     buttonText: string;
//     buttonVariant: "orange" | "blue";
//     tag?: string;
//     age_range?: string;
//     product_type?: string;
//     theme?: string;
//     raw: DIYProduct;
//   };

//   const mapToCardItem = (p: DIYProduct): CardItem => {
//     return {
//       id: String(p.id),
//       image: p.imges?.[0] || "/placeholder.svg",
//       imageAlt: p.title || "Product",
//       title: p.title || "Untitled",
//       description: p.description || "",
//       rating: p.avg_rating ?? 5,
//       reviews: p.total_review ?? 0,
//       currentPrice: p.discounted_price ?? p.price ?? 0,
//       price: p.price ?? 0,
//       discountedPrice: p.discounted_price!,
//       tags: [p.product_type ?? "", p.age_range ?? "", p.theme ?? ""].filter(Boolean),
//       buttonText: "Add to Cart",
//       buttonVariant: "blue",
//       tag: p.theme ?? undefined,
//       age_range: p.age_range,
//       product_type: p.product_type,
//       theme: p.theme,
//       raw: p,
//     };
//   };

//   // Transform for CustomizeTshirtModal expected shape
//   type ModalProduct = {
//     id: number;
//     image: string;
//     imageAlt: string;
//     title: string;
//     description: string;
//     rating: number;
//     reviews: number;
//     currentPrice: number;
//     originalPrice: number;
//     tags: string[];
//     buttonText: string;
//     buttonVariant: string;
//     tag?: string;
//   };

//   const transformForModal = (p: DIYProduct): ModalProduct => {
//     return {
//       id: Number(p.id ?? 0),
//       image: p.imges?.[0] || "/placeholder.svg",
//       imageAlt: p.title || "Product",
//       title: p.title || "Untitled",
//       description: p.description || "",
//       rating: p.avg_rating ?? 5,
//       reviews: p.total_review ?? 0,
//       currentPrice: p.discounted_price ?? p.price ?? 0,
//       originalPrice: p.price ?? 0,
//       tags: [p.product_type ?? "", p.age_range ?? "", p.theme ?? ""].filter(Boolean),
//       buttonText: "Customize T-Shirt",
//       buttonVariant: "orange",
//       tag: p.theme ?? undefined,
//     };
//   };

//   // Render stars
//   const renderStars = (rating: number) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
//     }

//     if (hasHalfStar) {
//       stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
//     }

//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
//     }

//     return stars;
//   };

//   const getButtonClasses = (buttonVariant: "orange" | "blue") =>
//     buttonVariant === "orange"
//       ? "bg-[#FFAB00] hover:bg-orange-600 text-white"
//       : "bg-[#223B7D] hover:bg-blue-500 text-white";

//   // ---------- Action handlers ----------

//   const handleAddToCart = (item: CardItem, e?: React.MouseEvent) => {
//     console.log(item)
//     e?.stopPropagation();
//     dispatch(
//       addToCart({
//         id: item.id,
//         title: item.title,
//         price: item.price,
//         discounted_price: item.discountedPrice ?? item.price,
//         quantity: 1,
//         image: item.image,
//         rating: item.rating,
//       })
//     );
//     toast.success(`${item.title} added to cart!`);
//   };

//   const handleCheckout = (item: CardItem, e?: React.MouseEvent) => {
//     e?.stopPropagation();
//     dispatch(
//       addToCart({
//         id: item.id,
//         title: item.title,
//         price: item.currentPrice,
//         discounted_price: item.discountedPrice ?? item.price,
//         quantity: 1,
//         image: item.image,
//         rating: item.rating,
//       })
//     );
//     toast.success(`${item.title} added to cart — redirecting to checkout`);
//     navigate("/home/diyboxChackout");
//   };

//   const handleWishlistToggle = async (item: CardItem, e?: React.MouseEvent) => {
//     e?.stopPropagation();

//     const isInWishlist = wishlist.some((w: any) => String(w.id) === String(item.id));
//     setWishlistLoadingStates(prev => ({ ...prev, [item.id]: true }));

//     try {
//       if (isInWishlist) {
//         const result = await removeFromWishlistApi(item.id).unwrap();
//         toast.success(`${item.title} removed from wishlist!`);
//         console.log('Removed from wishlist:', result);
//       } else {
//         const result = await addToWishlistApi({ product_id: item.id }).unwrap();
//         toast.success(`${item.title} added to wishlist!`);
//         console.log('Added to wishlist:', result);
//       }
//     } catch (error) {
//       console.error('Wishlist API error:', error);
//       const errorMessage = isInWishlist
//         ? `Failed to remove ${item.title} from wishlist. Please try again.`
//         : `Failed to add ${item.title} to wishlist. Please try again.`;
//       toast.error(errorMessage);

//       if (error && typeof error === 'object' && 'status' in error) {
//         if (error.status === 401) {
//           toast.error('Please log in to manage your wishlist');
//         } else if (error.status === 500) {
//           toast.error('Server error. Please try again later.');
//         }
//       }
//     } finally {
//       setWishlistLoadingStates(prev => ({ ...prev, [item.id]: false }));
//     }
//   };

//   const openCustomizeModal = (p: DIYProduct, e?: React.MouseEvent) => {
//     e?.stopPropagation();
//     setSelectedDIYProduct(p);
//     setOpenModal(true);
//   };

//   const handleCardClick = (id: string) => {
//     navigate(`/home/diyboxe/details/${id}`);
//   };

//   // ---------- Helper functions to check item status ----------
//   const isInWishlist = (itemId: string): boolean => {
//     return wishlist.some((w: any) => String(w.id) === String(itemId));
//   };

//   const isInCart = (itemId: string): boolean => {
//     return cart.some((c: any) => String(c.id) === String(itemId));
//   };

//   const isWishlistLoading = (itemId: string): boolean => {
//     return wishlistLoadingStates[itemId] || false;
//   };

//   // ---------- Build card data ----------
//   const cardItems: CardItem[] = diyProducts.map(mapToCardItem);

//   // ---------- Updated filtering logic ----------
//   const filteredItems = cardItems.filter((item) => {
//     const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.description.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesAge = !ageRange || ageRange === "all" ||
//       (item.age_range ?? "").toLowerCase().includes(ageRange.toLowerCase());

//     const matchesTheme = !theme || theme === "all" ||
//       (item.theme ?? "").toLowerCase().includes(theme.toLowerCase());

//     const matchesProductType = !productType || item.product_type === productType;

//     return matchesSearch && matchesAge && matchesTheme && matchesProductType;
//   });

//   // ---------- Loading / Error UI ----------
//   if (isLoading) {
//     return (
//       <div className="px-4">
//         <MyHeader title="Gift Shop" subtitle="Discover the perfect gifts with AI-powered recommendations" />
//         <div className="mt-10 max-w-7xl mx-auto text-center p-10">
//           <p className="text-gray-600">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="px-4">
//         <MyHeader title="Gift Shop" subtitle="Discover the perfect gifts with AI-powered recommendations" />
//         <div className="mt-10 max-w-7xl mx-auto text-center p-10">
//           <p className="text-red-500">Failed to load products. Try again later.</p>
//         </div>
//       </div>
//     );
//   }

//   // ---------- JSX ----------
//   return (
//     <div className="px-4">
//       <MyHeader
//         title="Gift Shop"
//         subtitle="Discover the perfect gifts with AI-powered recommendations"
//       />

//       {/* ---------- AI Recommended Section ---------- */}
//       {/* <section className="mt-6">
//         <div className="mx-auto max-w-7xl rounded-xl bg-[#BBDEFB] p-4 md:p-6">
//           <div className="mb-6 flex items-center gap-2 text-[#223B7D]">
//             <img src={shopIcon} alt="shop-icon" className="h-7 w-7" />
//             <h2 className="text-2xl font-bold">AI Recommended for You</h2>
//           </div>

//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
//               <div className="rounded-lg bg-[#FFF7ED]">
//                 <img
//                   src={img1}
//                   alt="Personalized Birthday T-Shirt"
//                   className="h-48 w-full rounded-lg object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-xl font-medium text-gray-800">
//                     Personalized Birthday T-Shirt
//                   </h3>
//                   <div className="mt-6 mb-2 flex items-center justify-between">
//                     <span className="text-lg font-bold text-[#223B7D]">
//                       $12.90
//                     </span>
//                     <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
//                       AI Pick
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
//               <div className="rounded-lg bg-[#FFF7ED]">
//                 <img
//                   src={img2}
//                   alt="LEGO Creator"
//                   className="h-48 w-full rounded-lg object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-xl font-medium text-gray-800">
//                     LEGO Creator 3-in-1 Deep Sea
//                   </h3>
//                   <div className="mt-6 mb-2 flex items-center justify-between">
//                     <span className="text-lg font-bold text-[#223B7D]">
//                       $49.99
//                     </span>
//                     <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
//                       AI Pick
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="overflow-hidden rounded-xl bg-white p-4 shadow-md">
//               <div className="rounded-lg bg-[#FFF7ED]">
//                 <img
//                   src={img3}
//                   alt="Superhero Cape"
//                   className="h-48 w-full rounded-lg object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-xl font-medium text-gray-800">
//                     Superhero Cape & Mask Set
//                   </h3>
//                   <div className="mt-6 mb-2 flex items-center justify-between">
//                     <span className="text-lg font-bold text-[#223B7D]">
//                       $49.99
//                     </span>
//                     <button className="rounded-full bg-[#223B7D] px-4 py-2 text-sm text-white hover:bg-blue-700">
//                       AI Pick
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section> */}

//       {/* ---------- Search & Filters ---------- */}
//       <section className="mt-10">
//         <div className="mx-auto flex max-w-7xl flex-col items-center space-y-4 rounded-xl bg-white p-4 sm:flex-row sm:space-y-0 sm:space-x-4">
//           <div className="relative w-full flex-1">
//             <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search themes, activities, or keywords..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               aria-label="Search themes, activities, or keywords"
//             />
//           </div>

//           {/* Product Type Filter */}
//           <div className="relative w-full sm:w-[140px]">
//             <select
//               value={productType}
//               onChange={(e) => setProductType(e.target.value as "" | "DIY_BOX" | "GIFT")}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               aria-label="Select product type"
//             >
//               <option value="">All Products</option>
//               <option value="DIY_BOX">DIY Boxes</option>
//               <option value="GIFT">Gifts</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <ChevronDown className="h-4 w-4" />
//             </div>
//           </div>

//           <div className="relative w-full sm:w-[140px]">
//             <select
//               value={ageRange}
//               onChange={(e) => setAgeRange(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               aria-label="Select age range"
//             >
//               <option value="">Age Range</option>
//               <option value="all">All Ages</option>
//               <option value="3-6">3-6 years</option>
//               <option value="5+">5+ years</option>
//               <option value="6-10">6-10 years</option>
//               <option value="8-12">8-12 years</option>
//               <option value="9-12">9-12 years</option>
//               <option value="10+">10+ years</option>
//               <option value="13+">13+ years</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <ChevronDown className="h-4 w-4" />
//             </div>
//           </div>

//           <div className="relative w-full sm:w-[120px]">
//             <select
//               value={theme}
//               onChange={(e) => setTheme(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               aria-label="Select theme"
//             >
//               <option value="">Theme</option>
//               <option value="all">All Themes</option>
//               <option value="SUPERHERO">Superhero</option>
//               <option value="adventure">Adventure</option>
//               <option value="education">Education</option>
//               <option value="creative">Creative</option>
//               <option value="sports">Sports</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <ChevronDown className="h-4 w-4" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ---------- Products Grid ---------- */}
//       <section className="mx-auto max-w-7xl">
//         {filteredItems.length === 0 ? (
//           <div className="mt-20 text-center p-10">
//             <p className="text-gray-600">No products found matching your criteria.</p>
//           </div>
//         ) : (
//           <div className="mt-20 grid grid-cols-1 gap-6 pb-14 md:grid-cols-2 lg:grid-cols-3">
//             <article
//               role="button"
//               tabIndex={0}
//               onClick={() => window.location.href = "https://amzn.to/3KHm6Ye"}
//               className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//             >
//               <div className="relative h-64 w-auto">
//                 <img
//                   src="https://i.ibb.co.com/1JG8MQMH/81v-YYe-K13-L-AC-SY550.jpg"
//                   alt="Image"
//                   className="h-full w-full object-cover"
//                 />
//                 <div className="absolute top-3 left-3">
//                   <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                     GIFT
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-grow flex-col p-6">
//                 <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                   Shuffle – Gabby et la Maison Magique - 4 Jeux en 1-7 Familles, Paires, Action et Batailles - Jeu de Cartes Enfants & Famille - A partir de 4 Ans
//                 </h3>
//                 <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                   À propos de cet article
//                   Découvrez Gabby et tous ses amis dans ce jeu de familles inédit ! 4 jeux disponibles dans une seule et même boîte !
//                   Découvrez 4 règles de jeux différentes pour seulement 1 jeu de cartes : jeu de 7 familles, jeu de paires, jeu d'action et jeu de batailles !
//                   Des vidéos explicatives sont disponibles en ligne, et ce dans 14 langues différentes.
//                   Contient 33 cartes et les règles des jeux
//                   À partir de 4 ans, de 2 à 10 joueurs : idéal pour jouer en famille ou entre amis
//                 </p>
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex items-center">{renderStars(4.6)}</div>
//                   <span className="text-sm font-medium text-gray-900">4.6</span>
//                   <span className="text-sm text-gray-500">(148 reviews)</span>
//                 </div>
//                 <div className="mt-auto flex gap-3">
//                   <button
//                     onClick={() => window.location.href = "https://amzn.to/3KHm6Ye"}
//                     className="w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </article>
//             <article
//               role="button"
//               tabIndex={0}
//               onClick={() => window.location.href = "https://amzn.to/48pBouy"}
//               className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//             >
//               <div className="relative h-64 w-auto">
//                 <img
//                   src="https://i.ibb.co.com/Dg44V4Ht/61h-CBp-QZji-L-SX522.jpg"
//                   alt="Image"
//                   className="h-full w-full object-cover"
//                 />
//                 <div className="absolute top-3 left-3">
//                   <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                     GIFT
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-grow flex-col p-6">
//                 <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                   Kzouenzu Happy Birthday Banner, Banner Banner, Personality Spiral Design, Birthday Party Decorations And Supplies, For Girls Boys Adults [Gold]
//                 </h3>
//                 <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                   [Elegant Design] - The happy birthday garland banner is hollowed out and gold design, which adds sparkle to celebrations. Simple and elegant banner for birthday party decorations, happy birthday decorations.
//                   [High quality] - Our banners are made of high quality paper, strong, durable.
//                   [Quality] - Reusable, this beautiful gold glitter garland will easily fit into any home. With its high-quality lettering, you can decorate your room in a blink of an eye. Perfect for a party and for taking beautiful pictures!
//                   [Occasion] - You can hang them from the ceiling, above the table, under the veranda or on the branches of trees. Enjoy the party..... these birthday party decorations are perfect for all ages!
//                   [Wide range of uses] - The handmade glitter banner with letters "Happy Birthday" is in a fashionable style and very beautiful. The garland can be perfectly combined with other decorations and beautiful decorative accents in your rooms. You can hang it anywhere, wall, branch, etc. This adds a cheerful atmosphere.
//                 </p>
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex items-center">{renderStars(4.9)}</div>
//                   <span className="text-sm font-medium text-gray-900">4.9</span>
//                   <span className="text-sm text-gray-500">(33 reviews)</span>
//                 </div>
//                 <div className="mt-auto flex gap-3">
//                   <button
//                     onClick={() => window.location.href = "https://amzn.to/48pBouy"}
//                     className="w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </article>
//             <article
//               role="button"
//               tabIndex={0}
//               onClick={() => window.location.href = "https://amzn.to/3VVLJa7"}
//               className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//             >
//               <div className="relative h-64 w-auto">
//                 <img
//                   src="https://i.ibb.co.com/Bxhqqvr/71-VKby-QOdq-L-AC-SX425.jpg"
//                   alt="Image"
//                   className="h-full w-full object-cover"
//                 />
//                 <div className="absolute top-3 left-3">
//                   <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                     GIFT
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-grow flex-col p-6">
//                 <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                   JOIYHY 26 x Birthday Cake Decoration, Butterfly Cake Topper for Decorating Birthday Cake for Children, Adults, Mother (Gold)
//                 </h3>
//                 <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                   Package includes: You will receive 24 butterflies cake toppers and 2 happy birthday toppers. They can be combined with different styles of cakes to make their cakes more attractive.
//                   【Safety material】 The butterfly cake topper is made of high quality paper, high strength, without deformation, comfortable to use. Cake topper is made of acrylic material, not easy to break and reusable.
//                   【DIY creation】 Decoración para tartas de cumpleaños can make your cake DIY, stimulate imagination and creativity in the process of making your own cake, make your cake more meaningful, Decoracion para tartas de cumpleaños can add a little fantasy to the cake for this special occasion.
//                   【Easy to use】The butterfly cake topper is very easy to use, you can put the butterfly directly on the cake, or you can use a stick to put the butterfly on the cake, all the pieces are cut precisely. You can even stick the butterfly to the wall as a wall decoration or staging.
//                   【Versatile Use】 It can be used as a delicate accessory for cakes, cupcakes, ice cream, cheese, fruit or any other dish you want to decorate, perfect for birthday parties, baby showers, parties or other events.
//                 </p>
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex items-center">{renderStars(4.4)}</div>
//                   <span className="text-sm font-medium text-gray-900">4.4</span>
//                   <span className="text-sm text-gray-500">(4 reviews)</span>
//                 </div>
//                 <div className="mt-auto flex gap-3">
//                   <button
//                     onClick={() => window.location.href = "https://amzn.to/3VVLJa7"}
//                     className="w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </article>
//             <article
//               role="button"
//               tabIndex={0}
//               onClick={() => window.location.href = "https://amzn.to/47i2xOO"}
//               className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//             >
//               <div className="relative h-64 w-auto">
//                 <img
//                   src="https://i.ibb.co.com/KRKPhR0/61vv-Zqc-Mu-XL-AC-SX679.jpg"
//                   alt="Image"
//                   className="h-full w-full object-cover"
//                 />
//                 <div className="absolute top-3 left-3">
//                   <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                     GIFT
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-grow flex-col p-6">
//                 <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                   Unicorn Girl Birthday Decoration - Garland + 10 Spiral Hanging Decorations for Unicorn Theme Party - Colourful Decorations for Children, Birthday Party, Wall or Ceiling
//                 </h3>
//                 <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                   【Complete Unicorn Decoration Kit】Our unicorn birthday decoration kit includes a unicorn garland "Happy Birthday" and 10 spiral hangers, for effortless fairy girl birthday decoration.
//                   Unicorn Fairy Design for Girls: The brightly colored unicorn, stars and rainbow patterns create a magical atmosphere, perfect for a girl's unicorn birthday or children's party.
//                   ❃【Safe & Reusable Materials】Made of quality paper and plastic, our unicorn girl birthday decoration is non-toxic, lightweight and reusable - ideal for long-lasting parties.
//                   Easy installation without tools: the unicorn garland and spiral hanging lights can be easily attached without tools, glue or tape - perfect for walls, windows, ceilings or trees.
//                   【Versatile Use for Any Occasion】Suitable for unicorn birthday, baby shower, carnival, children's party decoration, christening or unicorn theme - a magical decoration for any moment.
//                 </p>
//                 <div className="mb-4 flex items-center gap-2">
//                   <span className="text-sm text-gray-500">(0 reviews)</span>
//                 </div>
//                 <div className="mt-auto flex gap-3">
//                   <button
//                     onClick={() => window.location.href = "https://amzn.to/47i2xOO"}
//                     className="w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </article>
//             <article
//               role="button"
//               tabIndex={0}
//               onClick={() => window.location.href = "https://amzn.to/3Wy6xEK"}
//               className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//             >
//               <div className="relative h-64 w-auto">
//                 <img
//                   src="https://i.ibb.co.com/95Fzybb/41-M-M3hf-Fo-L-AC.jpg"
//                   alt="Image"
//                   className="h-full w-full object-cover"
//                 />
//                 <div className="absolute top-3 left-3">
//                   <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                     GIFT
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-grow flex-col p-6">
//                 <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                   Unicorn Cake Decoration Handmade Cupcake Topper Set with Eyelashes Reusable for Birthday Party Wedding Baby Shower
//                 </h3>
//                 <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                   The unicorn cupcake topper set is made of card paper, which is strong and does not fade on food.We provide wooden sticks, paper straws and glue dots for you to decorate the birthday cakes as you like.
//                   You will get 1 cute unicorn cake topper set, including 1 unicorn horn, 1 happy birthday banner, 2 ears, 2 eyes, 2 blushers and 3 flowers and 3 paper straws and A little glue is very suitable for decorating children's birthday cakes.
//                   These party hats and accessories are designed with unicorn elements.Cute shapes and beautiful colors are children's favorites, and they are very suitable for unicorn theme party decorations. Add unique colors to your big parties.
//                   The unicorn cake top hat is the perfect size. It is very suitable for 8 to 9 inch cakes and you can adjust the insertion depth of the pins to make the height of the cake lid different.
//                   Very suitable for children's birthday party, wedding party, unicorn theme party decoration, will attract the interest of children and adults.
//                 </p>
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex items-center">{renderStars(4.1)}</div>
//                   <span className="text-sm font-medium text-gray-900">4.1</span>
//                   <span className="text-sm text-gray-500">(44 reviews)</span>
//                 </div>
//                 <div className="mt-auto flex gap-3">
//                   <button
//                     onClick={() => window.location.href = "https://amzn.to/3Wy6xEK"}
//                     className="w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </article>
//             <article
//               role="button"
//               tabIndex={0}
//               onClick={() => window.location.href = "https://amzn.to/4mXtXyg"}
//               className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//             >
//               <div className="relative h-64 w-auto">
//                 <img
//                   src="https://i.ibb.co.com/6JPtWtC2/71-Z0dn-Rjtq-L-AC-SX425.jpg"
//                   alt="Image"
//                   className="h-full w-full object-cover"
//                 />
//                 <div className="absolute top-3 left-3">
//                   <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                     GIFT
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-grow flex-col p-6">
//                 <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                   Baby Teething Ball for Newborn 0-3 Months, Sensory Early Learning Games, Rattle Development, Educational Gift for Children Boy and Girl 3, 6, 9, 12 Months, 1 Year
//                 </h3>
//                 <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                   [Baby Teether]: It is made of food grade silicone & ABS with 12 soft chewing points and 2 different textured surfaces, intended to relieve the pain of teething babies in oral step. It also promotes chewing and biting movements of the baby.
//                   [ Sensory baby toy 6 months: More than just a teether, it is also a sensory baby game 0-3 months babies. It makes a rattle sound when twisted or shaken, thus attracting the attention of newborns, in addition to the bright colors that help with visual stimulation and color learning.
//                   [ For small hands]: Our Montessori baby toy 0-6 months is lightweight and perfect size to encourage little hands to reach and grasp. The baby can play with it in the crib, stroller, car, plane, etc.
//                   [ Newborn baby girl boy gift 6-12 months]: No small detachable parts, babies can play with this toy freely and safely without parental supervision. Suitable for newborns 0 months and up.
//                   [Easy to clean]: It must be fully cleaned before first use. Made of heat-resistant materials, it can be cleaned by ultraviolet light, steam
//                   [Product Size]: 10.5*10.5*7cm, Product weight: 110g
//                 </p>
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex items-center">{renderStars(4.6)}</div>
//                   <span className="text-sm font-medium text-gray-900">4.6</span>
//                   <span className="text-sm text-gray-500">(1735 reviews)</span>
//                 </div>
//                 <div className="mt-auto flex gap-3">
//                   <button
//                     onClick={() => window.location.href = "https://amzn.to/4mXtXyg"}
//                     className="w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </article>
//             <article
//               role="button"
//               tabIndex={0}
//               onClick={() => window.location.href = "https://amzn.to/3IYedx1"}
//               className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//             >
//               <div className="relative h-64 w-auto">
//                 <img
//                   src="https://i.ibb.co.com/d0dZKJR9/71v6e-Al-Jus-S-AC-SX679-PIbundle-28-Top-Right-0-0-SH20.jpg"
//                   alt="Image"
//                   className="h-full w-full object-cover"
//                 />
//                 <div className="absolute top-3 left-3">
//                   <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800`}>
//                     GIFT
//                   </span>
//                 </div>
//               </div>
//               <div className="flex flex-grow flex-col p-6">
//                 <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                   Ravensburger - Educational Game - Domino - Paw Patrol - A First Educational Game Mixing Observation, Association and Memorization - From 3 Years - 20739
//                 </h3>
//                 <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                   The domino is a classic for ages 3 and up. The principle of image association allows the child to develop his ability to observe and think. This game with simple rules unites generations and allows you to enjoy the pleasure of being together: the happiness of playing far from the screens!
//                   Who will put the most dominoes in a row? Will you be able to assemble all the characters of the Paw Patrol? In this little "paw patrol" domino you will find beautiful illustrations that delight young and old. Each card hides an iconic PAW Patrol character: Chase, Ruben, Marcus, Stella, Rocky and Zuma.
//                   Simple rules. Mix the dominoes face down. The first player puts one of his dominoes. The next player looks at his dominoes, if he has one of the two images that matches the first player's card, he puts it in a row. The goal of the game is to get rid of all of your dominoes to win!
//                   Contents: 28 dominoes on the Paw Patrol universe. This product consists of materials from well-managed FSC-certified forests, recycled materials and materials from other controlled sources (FSC-C111262). This product was made in Europe."
//                   All our small domino memory lotto are present to accompany your child in educational entertainment. Your child can challenge their memory with themes such as: pets and baby animals. And can find these favorite heroes with the characters of Frozen Little Brown Bear, Peppa Pig and T'choupi.
//                 </p>
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex items-center">{renderStars(4.7)}</div>
//                   <span className="text-sm font-medium text-gray-900">4.7</span>
//                   <span className="text-sm text-gray-500">(1076 reviews)</span>
//                 </div>
//                 <div className="mt-auto flex gap-3">
//                   <button
//                     onClick={() => window.location.href = "https://amzn.to/3IYedx1"}
//                     className="w-full rounded-lg border bg-[#223B7D] border-[#223B7D] px-4 py-3 text-gray-50 transition-colors"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </article>
//             {filteredItems.map((item) => {
//               const liked = isInWishlist(item.id);
//               const inCart = isInCart(item.id);
//               const wishlistLoading = isWishlistLoading(item.id);

//               return (
//                 <article
//                   key={item.id}
//                   role="button"
//                   tabIndex={0}
//                   onClick={() => handleCardClick(item.id)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleCardClick(item.id);
//                   }}
//                   className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
//                   aria-label={`Open details for ${item.title}`}
//                 >
//                   {/* Image + wishlist button */}
//                   <div className="relative h-64 w-auto">
//                     <img
//                       src={item.image}
//                       alt={item.imageAlt}
//                       className="h-full w-full object-cover"
//                     />

//                     {/* Product type badge */}
//                     <div className="absolute top-3 left-3">
//                       <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${item.product_type === 'DIY_BOX'
//                         ? 'bg-blue-100 text-blue-800'
//                         : 'bg-green-100 text-green-800'
//                         }`}>
//                         {item.product_type === 'DIY_BOX' ? 'DIY Box' : 'Gift'}
//                       </span>
//                     </div>

//                     {/* Wishlist heart */}
//                     <button
//                       onClick={(e) => handleWishlistToggle(item, e)}
//                       disabled={wishlistLoading}
//                       aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
//                       className={`absolute top-3 right-3 rounded-full bg-white p-2 shadow-sm transition-colors ${wishlistLoading
//                         ? "opacity-50 cursor-not-allowed"
//                         : "hover:bg-gray-50"
//                         }`}
//                     >
//                       {wishlistLoading ? (
//                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
//                       ) : (
//                         <HeartIcon
//                           fill={liked ? "red" : "none"}
//                           color={liked ? "red" : "currentColor"}
//                           className="h-5 w-5"
//                         />
//                       )}
//                     </button>
//                   </div>

//                   {/* Content */}
//                   <div className="flex flex-grow flex-col p-6">
//                     <h3 className="mb-2 text-xl font-semibold text-[#191919]">
//                       {item.title}
//                     </h3>

//                     <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
//                       {item.description}
//                     </p>

//                     {/* Rating */}
//                     <div className="mb-4 flex items-center gap-2">
//                       <div className="flex items-center">{renderStars(item.rating)}</div>
//                       <span className="text-sm font-medium text-gray-900">{item.rating}</span>
//                       <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
//                     </div>

//                     {/* Tags & Price */}
//                     <div className="mt-3 mb-4 flex items-center justify-between">
//                       <div className="flex items-baseline gap-1">
//                         <span className="text-xl font-bold text-gray-900">
//                           ${item.currentPrice}
//                         </span>
//                         {item.discountedPrice && item.price !== item.currentPrice && (
//                           <span className="text-sm text-gray-500 line-through">
//                             ${item.price}
//                           </span>
//                         )}
//                       </div>
//                       <span className="inline-flex items-center rounded-full bg-[#58C0644D] px-3 py-1 text-xs font-normal text-[#19AE19]">
//                         {item.age_range ?? "All ages"}
//                       </span>
//                     </div>

//                     {/* Action buttons */}
//                     <div className="mt-auto flex gap-3">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (item.buttonText === "Customize T-Shirt") {
//                             openCustomizeModal(item.raw, e);
//                           } else {
//                             handleAddToCart(item, e);
//                           }
//                         }}
//                         className={`flex-1 rounded-lg px-4 py-3 font-medium text-white transition-colors ${getButtonClasses(item.buttonVariant)} ${inCart && item.buttonText !== "Customize T-Shirt" ? "opacity-75" : ""
//                           }`}
//                         disabled={inCart && item.buttonText !== "Customize T-Shirt"}
//                       >
//                         <span className="mr-2 inline-block align-middle">
//                           {item.buttonText === "Customize T-Shirt" ? (
//                             <img src={printBrash} alt="" className="h-5 inline-block" />
//                           ) : (
//                             <img src={shopingTrolly} alt="" className="h-5 inline-block" />
//                           )}
//                         </span>
//                         {inCart && item.buttonText !== "Customize T-Shirt" ? "In Cart" : item.buttonText}
//                       </button>

//                       <button
//                         onClick={(e) => handleCheckout(item, e)}
//                         className="rounded-lg border border-[#223B7D] px-4 py-3 text-[#223B7D] hover:bg-gray-50 transition-colors"
//                       >
//                         Checkout
//                       </button>
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>
//         )}

//         <div className="mb-20 flex justify-center md:justify-end">
//           <button
//             onClick={() => navigate("/shop")}
//             className="rounded-lg border border-[#223B7D] px-6 py-3 text-[#223B7D] hover:bg-gray-50 transition-colors"
//           >
//             View all
//           </button>
//         </div>
//       </section>

//       {/* Modal */}
//       {openModal && selectedDIYProduct && (
//         <CustomizeTshirtModal
//           product={transformForModal(selectedDIYProduct)}
//           onClose={() => {
//             setOpenModal(false);
//             setSelectedDIYProduct(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }
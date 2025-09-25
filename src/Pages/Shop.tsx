/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, Search, Heart as HeartIcon } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

import img1 from "@/assets/shop-1.jpg";
import img2 from "@/assets/shop-2.jpg";
import img3 from "@/assets/shop-3.jpg";
import shopIcon from "@/assets/shop-icon.png";
import printBrash from "@/assets/printBrash.png";
import shopingTrolly from "@/assets/shopping-cart.png";

import CustomizeTshirtModal from "@/components/shop/CustomizeTshirtModal";
import MyHeader from "@/components/MyHeader/MyHeader";

import toast from "react-hot-toast";

// Redux imports (matches your DiyBoxes pattern)
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/features/wishlist/wishlistSlice";

// RQ / RTK Query hook + type
import { useGetDIYProductsQuery } from "@/redux/features/diyProducts/diyProductsApi";
import type { DIYProduct } from "@/redux/types/diy.types";
import { useAddToWishlistApiMutation, useRemoveFromWishlistApiMutation } from "@/redux/features/wishlist/wishlistApi";

export default function Shop(): JSX.Element {
  // UI controls
  const [searchTerm, setSearchTerm] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [theme, setTheme] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Fixed: Properly access wishlist and cart from Redux state
  const wishlist = useAppSelector((state: any) => state.wishlist?.items ?? []);
  const cart = useAppSelector((state: any) => state.cart?.items ?? []);

  // Fixed: Properly initialize API mutations
  const [addToWishlistApi] = useAddToWishlistApiMutation();
  const [removeFromWishlistApi] = useRemoveFromWishlistApiMutation();

  // Modal state (we store original DIYProduct and transform when passing into modal)
  const [openModal, setOpenModal] = useState(false);
  const [selectedDIYProduct, setSelectedDIYProduct] = useState<DIYProduct | null>(null);

  // Fixed: Add loading states for individual items
  const [wishlistLoadingStates, setWishlistLoadingStates] = useState<{[key: string]: boolean}>({});

  // Fetch DIY products
  const { data, isLoading, isError } = useGetDIYProductsQuery();
  const diyProducts: DIYProduct[] = Array.isArray(data) ? data : data ? [data] : [];

  // Debug: log search params (keeps behavior from previous file)
  useEffect(() => {
    console.log("Search params:", { searchTerm, ageRange, theme });
  }, [searchTerm, ageRange, theme]);

  // ---------- Helpers & transformers ----------

  // Map the raw DIYProduct into a UI-friendly card object (and a shape compatible with your modal)
  type CardItem = {
    id: string; // Fixed: Changed to string to match your slice expectation
    image: string;
    imageAlt: string;
    title: string;
    description: string;
    rating: number;
    reviews: number;
    currentPrice: number;
    originalPrice: number;
    tags: string[];
    buttonText: string;
    buttonVariant: "orange" | "blue";
    tag?: string;
    age_range?: string;
    product_type?: string;
    raw: DIYProduct;
  };

  const mapToCardItem = (p: DIYProduct): CardItem => {
    return {
      id: String((p as any).id ?? p.id ?? "0"), // Fixed: Ensure ID is always a string
      image: (p as any).imges?.[0] || "/placeholder.svg",
      imageAlt: p.title || "Product",
      title: p.title || "Untitled",
      description: p.description || "",
      rating: (p as any).avg_rating ?? (p as any).rating ?? 5,
      reviews: (p as any).total_review ?? (p as any).reviews ?? 0,
      currentPrice: (p as any).price ?? (p as any).currentPrice ?? 0,
      originalPrice: (p as any).originalPrice ?? (p as any).price ?? 0,
      tags: [p.product_type ?? "", p.age_range ?? ""].filter(Boolean),
      buttonText: p.product_type === "tshirt" ? "Customize T-Shirt" : "Add to Cart",
      buttonVariant: p.product_type === "tshirt" ? "orange" : "blue",
      tag: (p as any).tag ?? undefined,
      age_range: p.age_range,
      product_type: p.product_type,
      raw: p,
    };
  };

  // Transform for CustomizeTshirtModal expected shape
  type ModalProduct = {
    id: number;
    image: string;
    imageAlt: string;
    title: string;
    description: string;
    rating: number;
    reviews: number;
    currentPrice: number;
    originalPrice: number;
    tags: string[];
    buttonText: string;
    buttonVariant: string;
    tag?: string;
  };

  const transformForModal = (p: DIYProduct): ModalProduct => {
    return {
      id: Number((p as any).id ?? p.id ?? 0), // Keep as number for modal compatibility
      image: (p as any).imges?.[0] || "/placeholder.svg",
      imageAlt: p.title || "Product",
      title: p.title || "Untitled",
      description: p.description || "",
      rating: (p as any).avg_rating ?? (p as any).rating ?? 5,
      reviews: (p as any).total_review ?? (p as any).reviews ?? 0,
      currentPrice: (p as any).price ?? (p as any).currentPrice ?? 0,
      originalPrice: (p as any).originalPrice ?? (p as any).price ?? 0,
      tags: [p.product_type ?? "", p.age_range ?? ""].filter(Boolean),
      buttonText: "Customize T-Shirt",
      buttonVariant: "orange",
      tag: (p as any).tag ?? undefined,
    };
  };

  // Render stars (keeps your previous behavior)
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

  const getButtonClasses = (buttonVariant: "orange" | "blue") =>
    buttonVariant === "orange"
      ? "bg-[#FFAB00] hover:bg-orange-600 text-white"
      : "bg-[#223B7D] hover:bg-blue-500 text-white";

  // ---------- Action handlers ----------

  const handleAddToCart = (item: CardItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    dispatch(
      addToCart({
        id: item.id, // Now properly string
        title: item.title,
        price: item.currentPrice,
        quantity: 1,
        image: item.image,
        rating: item.rating,
      })
    );
    toast.success(`${item.title} added to cart!`);
  };

  const handleCheckout = (item: CardItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Add to cart then navigate to checkout
    dispatch(
      addToCart({
        id: item.id, // Now properly string
        title: item.title,
        price: item.currentPrice,
        quantity: 1,
        image: item.image,
        rating: item.rating,
      })
    );
    toast.success(`${item.title} added to cart — redirecting to checkout`);
    navigate("/checkout"); // adapt route if different in your app
  };

  // Fixed: Proper wishlist toggle functionality with API integration
  const handleWishlistToggle = async (item: CardItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    const isInWishlist = wishlist.some((w: any) => String(w.id) === String(item.id));

    // Set loading state for this specific item
    setWishlistLoadingStates(prev => ({ ...prev, [item.id]: true }));

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const result = await removeFromWishlistApi(item.id).unwrap();
        
        // Only update local state if API call was successful
        dispatch(removeFromWishlist(item.id));
        toast.success(`${item.title} removed from wishlist!`);
        
        console.log('Removed from wishlist:', result);
      } else {
        // Add to wishlist
        const result = await addToWishlistApi({ product_id: item.id }).unwrap();
        
        // Only update local state if API call was successful
        dispatch(
          addToWishlist({
            id: item.id,
            title: item.title,
            price: item.currentPrice,
            image: item.image,
          })
        );
        toast.success(`${item.title} added to wishlist!`);
        
        console.log('Added to wishlist:', result);
      }
    } catch (error) {
      // Handle API errors
      console.error('Wishlist API error:', error);
      
      // Show appropriate error message
      const errorMessage = isInWishlist 
        ? `Failed to remove ${item.title} from wishlist. Please try again.`
        : `Failed to add ${item.title} to wishlist. Please try again.`;
      
      toast.error(errorMessage);
      
      // Optional: You might want to handle specific error cases
      if (error && typeof error === 'object' && 'status' in error) {
        if (error.status === 401) {
          toast.error('Please log in to manage your wishlist');
        } else if (error.status === 500) {
          toast.error('Server error. Please try again later.');
        }
      }
    } finally {
      // Clear loading state for this item
      setWishlistLoadingStates(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const openCustomizeModal = (p: DIYProduct, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedDIYProduct(p);
    setOpenModal(true);
  };

  const handleCardClick = (id: string) => { // Fixed: Changed parameter type to string
    navigate(`/home/diyboxe/details/${id}`);
  };

  // ---------- Helper functions to check item status ----------
  const isInWishlist = (itemId: string): boolean => {
    return wishlist.some((w: any) => String(w.id) === String(itemId));
  };

  const isInCart = (itemId: string): boolean => {
    return cart.some((c: any) => String(c.id) === String(itemId));
  };

  // Fixed: Helper to check if item is loading in wishlist operations
  const isWishlistLoading = (itemId: string): boolean => {
    return wishlistLoadingStates[itemId] || false;
  };

  // ---------- Build card data ----------
  const cardItems: CardItem[] = diyProducts.map(mapToCardItem);

  // ---------- Filtered items ----------
  const filteredItems = cardItems.filter((it) => {
    const matchesSearch = it.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge =
      !ageRange || ageRange === "all" ? true : (it.age_range ?? "").includes(ageRange);
    const matchesTheme =
      !theme || theme === "all" ? true : (it.product_type ?? "").toLowerCase().includes(theme.toLowerCase());
    return matchesSearch && matchesAge && matchesTheme;
  });

  // ---------- Loading / Error UI ----------
  if (isLoading) {
    return (
      <div className="px-4">
        <MyHeader title="Gift Shop" subtitle="Discover the perfect gifts with AI-powered recommendations" />
        <div className="mt-10 max-w-7xl mx-auto text-center p-10">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4">
        <MyHeader title="Gift Shop" subtitle="Discover the perfect gifts with AI-powered recommendations" />
        <div className="mt-10 max-w-7xl mx-auto text-center p-10">
          <p className="text-red-500">Failed to load products. Try again later.</p>
        </div>
      </div>
    );
  }

  // ---------- JSX ----------
  return (
    <div className="px-4">
      <MyHeader
        title="Gift Shop"
        subtitle="Discover the perfect gifts with AI-powered recommendations"
      />

      {/* ---------- AI Recommended Section (re-added) ---------- */}
      <section className="mt-6">
        <div className="mx-auto max-w-7xl rounded-xl bg-[#BBDEFB] p-4 md:p-6">
          <div className="mb-6 flex items-center gap-2 text-[#223B7D]">
            <img src={shopIcon} alt="shop-icon" className="h-7 w-7" />
            <h2 className="text-2xl font-bold">AI Recommended for You</h2>
          </div>

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
                      $12.90
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
                  alt="LEGO Creator"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-800">
                    LEGO Creator 3-in-1 Deep Sea
                  </h3>
                  <div className="mt-6 mb-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#223B7D]">
                      $49.99
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
                  alt="Superhero Cape"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-medium text-gray-800">
                    Superhero Cape & Mask Set
                  </h3>
                  <div className="mt-6 mb-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#223B7D]">
                      $49.99
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
      </section>

      {/* ---------- Search & Filters ---------- */}
      <section className="mt-10">
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
              <option value="">Age Range</option>
              <option value="all">All Ages</option>
              <option value="0-5">0-5</option>
              <option value="6-12">6-12</option>
            </select>
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
              <option value="">Theme</option>
              <option value="all">All Themes</option>
              <option value="adventure">Adventure</option>
              <option value="education">Education</option>
              <option value="creative">Creative</option>
              <option value="sports">Sports</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Products Grid ---------- */}
      <section className="mx-auto max-w-7xl">
        <div className="mt-20 grid grid-cols-1 gap-6 pb-14 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const liked = isInWishlist(item.id);
            const inCart = isInCart(item.id);
            const wishlistLoading = isWishlistLoading(item.id);
            
            return (
              <article
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCardClick(item.id);
                }}
                className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                aria-label={`Open details for ${item.title}`}
              >
                {/* Image + wishlist button */}
                <div className="relative h-64 w-auto">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-full w-full object-cover"
                  />

                  {/* Fixed: Wishlist heart with proper toggle functionality and loading state */}
                  <button
                    onClick={(e) => handleWishlistToggle(item, e)}
                    disabled={wishlistLoading}
                    aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-3 right-3 rounded-full bg-white p-2 shadow-sm transition-colors ${
                      wishlistLoading 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {wishlistLoading ? (
                      // Show loading spinner when API call is in progress
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
                    ) : (
                      <HeartIcon 
                        fill={liked ? "red" : "none"} 
                        color={liked ? "red" : "currentColor"} 
                        className="h-5 w-5"
                      />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="flex flex-grow flex-col p-6">
                  <h3 className="mb-2 text-xl font-semibold text-[#191919]">
                    {item.title}
                  </h3>

                  <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center">{renderStars(item.rating)}</div>
                    <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                    <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                  </div>

                  {/* Tags & Price */}
                  <div className="mt-3 mb-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-gray-900">${item.currentPrice}</span>
                      {item.originalPrice !== item.currentPrice && (
                        <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#58C0644D] px-3 py-1 text-xs font-normal text-[#19AE19]">
                      {item.age_range ?? "All ages"}
                    </span>
                  </div>

                  {/* Action buttons (stop propagation) */}
                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // If product is a tshirt, open customize modal; otherwise add to cart
                        if (item.buttonText === "Customize T-Shirt") {
                          openCustomizeModal(item.raw, e);
                        } else {
                          handleAddToCart(item, e);
                        }
                      }}
                      className={`flex-1 rounded-lg px-4 py-3 font-medium text-white transition-colors ${getButtonClasses(item.buttonVariant)} ${
                        inCart && item.buttonText !== "Customize T-Shirt" ? "opacity-75" : ""
                      }`}
                      disabled={inCart && item.buttonText !== "Customize T-Shirt"}
                    >
                      {/* Icon */}
                      <span className="mr-2 inline-block align-middle">
                        {item.buttonText === "Customize T-Shirt" ? (
                          <img src={printBrash} alt="" className="h-5 inline-block" />
                        ) : (
                          <img src={shopingTrolly} alt="" className="h-5 inline-block" />
                        )}
                      </span>
                      {inCart && item.buttonText !== "Customize T-Shirt" ? "In Cart" : item.buttonText}
                    </button>

                    <button
                      onClick={(e) => handleCheckout(item, e)}
                      className="rounded-lg border border-[#223B7D] px-4 py-3 text-[#223B7D] hover:bg-gray-50 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mb-20 flex justify-center md:justify-end">
          <button
            onClick={() => navigate("/shop")} // or your "view all" route
            className="rounded-lg border border-[#223B7D] px-6 py-3 text-[#223B7D] hover:bg-gray-50 transition-colors"
          >
            View all
          </button>
        </div>
      </section>

      {/* Modal */}
      {openModal && selectedDIYProduct && (
        <CustomizeTshirtModal
          product={transformForModal(selectedDIYProduct)}
          onClose={() => {
            setOpenModal(false);
            setSelectedDIYProduct(null);
          }}
        />
      )}
    </div>
  );
}
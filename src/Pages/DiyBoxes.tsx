import { useState } from "react";
import {
  Search,
  Clock,
  Users,
  ShoppingCart,
  ChevronDown,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import MyHeader from "@/components/MyHeader/MyHeader";
import PremiumBanner from "@/components/Home/PremiumBanner";
import toast from "react-hot-toast";

// Redux imports
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/features/wishlist/wishlistSlice";

// Updated API hook to use the new structure
import { useGetDIYBoxesQuery } from "@/redux/features/diyProducts/diyProductsApi";
import type { DIYProduct } from "@/redux/types/diy.types";
import { useAddToWishlistApiMutation, useRemoveFromWishlistApiMutation } from "@/redux/features/wishlist/wishlistApi";

export default function DiyBoxes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [theme, setTheme] = useState("");

  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const cart = useAppSelector((state) => state.cart.items);

  // API mutations for wishlist
  const [addToWishlistApi] = useAddToWishlistApiMutation();
  const [removeFromWishlistApi] = useRemoveFromWishlistApiMutation();

  // Loading states for individual items
  const [wishlistLoadingStates, setWishlistLoadingStates] = useState<{[key: string]: boolean}>({});

  // Updated: Use the new API hook that returns only DIY boxes
  const { data: activities = [], isLoading, isError } = useGetDIYBoxesQuery();

  // Star rating renderer
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

  // Updated wishlist toggle with API integration
  const toggleLike = async (item: DIYProduct) => {
    const isInWishlist = wishlist.some((w) => String(w.id) === String(item.id));
    
    // Set loading state for this specific item
    setWishlistLoadingStates(prev => ({ ...prev, [item.id]: true }));

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const result = await removeFromWishlistApi(String(item.id)).unwrap();
        dispatch(removeFromWishlist(String(item.id)));
        toast.success(`${item.title} removed from wishlist!`);
        console.log('Removed from wishlist:', result);
      } else {
        // Add to wishlist
        const result = await addToWishlistApi({ product_id: String(item.id) }).unwrap();
        dispatch(
          addToWishlist({
            id: String(item.id),
            title: item.title,
            price: item.discounted_price || item.price,
            image: item.imges?.[0] || "",
            description: item.description,
          })
        );
        toast.success(`${item.title} added to wishlist!`);
        console.log('Added to wishlist:', result);
      }
    } catch (error) {
      console.error('Wishlist API error:', error);
      const errorMessage = isInWishlist 
        ? `Failed to remove ${item.title} from wishlist. Please try again.`
        : `Failed to add ${item.title} to wishlist. Please try again.`;
      toast.error(errorMessage);
      
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

  // Helper functions
  const isInWishlist = (itemId: string): boolean => {
    return wishlist.some((w) => String(w.id) === String(itemId));
  };

  const isInCart = (itemId: string): boolean => {
    return cart.some((c) => String(c.id) === String(itemId));
  };

  const isWishlistLoading = (itemId: string): boolean => {
    return wishlistLoadingStates[itemId] || false;
  };

  // Enhanced filtering to work with new API structure
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAge = !ageRange || activity.age_range.toLowerCase().includes(ageRange.toLowerCase());
    
    const matchesTheme = !theme || 
                        (activity.theme && activity.theme.toLowerCase().includes(theme.toLowerCase())) ||
                        activity.product_type.toLowerCase().includes(theme.toLowerCase());
    
    return matchesSearch && matchesAge && matchesTheme;
  });

  if (isLoading) return <p className="text-center mt-20">Loading DIY boxes...</p>;
  if (isError) return <p className="text-center mt-20 text-red-500">Failed to load DIY boxes</p>;

  return (
    <div className="mx-auto w-full">
      <MyHeader
        title="DIY Party Boxes"
        subtitle="Everything you need for an amazing party, curated by experts and delivered to your door"
        className="text-3xl sm:text-5xl md:text-6xl"
      />

      {/* Search + Filters */}
      <div className="container mx-auto">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search themes, activities, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Updated Age Range options to match API data */}
            <div className="relative">
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Age Range</option>
                <option value="3-6">3-6 years</option>
                <option value="5+">5+ years</option>
                <option value="6-10">6-10 years</option>
                <option value="8-12">8-12 years</option>
                <option value="9-12">9-12 years</option>
                <option value="10+">10+ years</option>
                <option value="13+">13+ years</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Updated Theme options to match API data */}
            <div className="relative">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Theme</option>
                <option value="superhero">Superhero</option>
                <option value="princess">Princess</option>
                <option value="dinosaur">Dinosaur</option>
                <option value="adventure">Adventure</option>
                <option value="creative">Creative</option>
                <option value="educational">Educational</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto">
          {filteredActivities.length === 0 ? (
            <div className="text-center p-10">
              <p className="text-gray-600">No DIY boxes found matching your criteria.</p>
            </div>
          ) : (
            <div className="mx-auto mt-20 grid grid-cols-1 gap-6 px-4 pb-14 md:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map((activity) => {
                const liked = isInWishlist(String(activity.id));
                const inCart = isInCart(String(activity.id));
                const wishlistLoading = isWishlistLoading(String(activity.id));
                
                return (
                  <div
                    key={activity.id}
                    className="flex h-full flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-sm hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="relative h-64">
                      <img
                        src={activity.imges?.[0] || "/placeholder.svg"}
                        alt={activity.title}
                        className="h-full w-full object-cover"
                      />
                      
                      {/* Product type badge */}
                      <div className="absolute top-3 right-3 rounded-full bg-[#223B7D] px-3 py-1 text-sm text-white">
                        DIY Box
                      </div>
                      
                      {/* Updated wishlist button with loading state */}
                      <button
                        className="absolute top-3 left-3 rounded-full bg-white p-2 shadow-sm hover:bg-gray-50 transition-colors"
                        onClick={() => toggleLike(activity)}
                        disabled={wishlistLoading}
                        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {wishlistLoading ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
                        ) : (
                          <Heart
                            color={liked ? "red" : "currentColor"}
                            fill={liked ? "red" : "none"}
                            className="h-5 w-5"
                          />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-2 text-xl font-semibold text-[#191919]">
                        {activity.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-[#5A5C5F]">
                        {activity.description}
                      </p>

                      {/* Duration + Age */}
                      <div className="mb-4 flex justify-between text-sm text-[#5A5C5F]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {activity.age_range}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex">{renderStars(activity.avg_rating)}</div>
                        <span className="text-sm font-medium text-gray-900">
                          {activity.avg_rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({activity.total_review} reviews)
                        </span>
                      </div>

                      {/* Updated Price display to handle discounted_price */}
                      <div className="mb-4 flex justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-[#223B7D]">
                            ${activity.discounted_price || activity.price}
                          </span>
                          {activity.discounted_price && activity.discounted_price < activity.price && (
                            <span className="text-lg text-gray-500 line-through">
                              ${activity.price}
                            </span>
                          )}
                        </div>
                        <div className="rounded-full bg-[#58C06478]/70 px-3 py-2 text-xs font-medium text-[#19AE19]">
                          {activity.age_range}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-3">
                        <Link to={`/home/diyboxe/details/${activity.id}`} className="flex-1">
                          <button className="w-full rounded-lg bg-[#223B7D] px-4 py-3 font-medium text-white hover:bg-secondary-light">
                            View Details
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            if (!inCart) {
                              dispatch(
                                addToCart({
                                  id: String(activity.id),
                                  title: activity.title,
                                  price: activity.price,
                                  discounted_price: activity.discounted_price ?? activity.price,
                                  quantity: 1,
                                  image: activity.imges?.[0] || "",
                                  rating: activity.avg_rating,
                                })
                              );
                              toast.success(`${activity.title} added to cart!`);
                            }
                          }}
                          disabled={inCart}
                          className={`rounded-lg border border-[#223B7D] p-3 transition-colors ${
                            inCart 
                              ? "opacity-50 cursor-not-allowed bg-gray-100" 
                              : "hover:bg-gray-50"
                          }`}
                          aria-label={inCart ? "Already in cart" : "Add to cart"}
                        >
                          <ShoppingCart 
                            className={`h-5 w-5 ${inCart ? "text-gray-400" : "text-gray-600"}`} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Banner */}
      <PremiumBanner />
    </div>
  );
}
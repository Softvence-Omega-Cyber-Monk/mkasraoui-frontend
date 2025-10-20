import { useGetWishlistQuery, useRemoveFromWishlistApiMutation, type WishlistItem } from "@/redux/features/wishlist/wishlistApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";

function MyWishlist() {
  const { data: wishlist = [], isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistApiMutation();
  const dispatch = useDispatch();

  // ✅ Add to cart + auto remove from wishlist
  const handleAddToCart = async (item: WishlistItem) => {
    // Add item to cart
    dispatch(
      addToCart({
        id: item.prodcut.id,
        title: item.prodcut.title,
        price: item.prodcut.price,
        image: item.prodcut.imges[0] || "/placeholder.png",
        discounted_price: item.prodcut.discounted_price,
        quantity: 1,
      })
    );

    // Remove from wishlist via API
    await removeFromWishlist(item.id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          Your wishlist is empty 😢
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Title for the section */}
        <h2 className="mb-8 text-3xl font-extrabold text-gray-900 tracking-tight">Your Wishlist ({wishlist.length})</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item.id}
              // --- UPDATED CARD DESIGN CLASSES ---
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-300"
              // ------------------------------------
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  // --- UPDATED IMAGE CLASSES ---
                  className="h-60 w-full object-cover transition-transform duration-500 hover:scale-105"
                  // -----------------------------
                  src={item.prodcut.imges[0] || "/placeholder.png"}
                  alt={item.prodcut.title}
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                {/* Title and Description */}
                <div>
                  <h5 className="mb-1 line-clamp-2 text-xl font-semibold text-gray-800">
                    {item.prodcut.title}
                  </h5>
                  <p className="mb-4 text-sm line-clamp-3 text-gray-500">
                    {item.prodcut.description}
                  </p>
                </div>


                {/* Price and Action Buttons */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <span className="block mb-3 text-2xl font-extrabold text-secondary">
                    €{item.prodcut.price}
                  </span>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      // --- UPDATED BUTTON CLASSES ---
                      className="w-full sm:w-auto flex-1 rounded-lg bg-secondary px-4 py-2 text-white font-medium text-sm shadow-md transition-colors duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                      // ------------------------------
                    >
                      🛒 Add to Cart
                    </button>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      // --- UPDATED BUTTON CLASSES ---
                      className="w-full sm:w-auto rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 border border-red-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      // ------------------------------
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyWishlist;
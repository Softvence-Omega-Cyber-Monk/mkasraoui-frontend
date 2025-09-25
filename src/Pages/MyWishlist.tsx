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
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {/* Image */}
              <img
                className="h-64 w-full rounded-t-lg object-cover md:h-48 lg:h-56"
                src={item.prodcut.imges[0] || "/placeholder.png"}
                alt={item.prodcut.title}
              />

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <h5 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                  {item.prodcut.title}
                </h5>
                <p className="mb-3 line-clamp-3 text-gray-700 dark:text-gray-400">
                  {item.prodcut.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-lg font-bold">
                    ${item.prodcut.price}
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
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

import { useWishStore } from "@/store/useUserStore";

function MyWishlist() {
  const { wishlist, removeFromWishlist } = useWishStore();

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
    <div className="min-h-screen">
      <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-4">
          {wishlist.length === 0 ? (
            <div className="flex h-full min-h-[60vh] items-center justify-center">
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Your wishlist is empty 😢
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  {/* Image */}
                  <img
                    className="h-64 w-full rounded-t-lg object-cover md:h-48 lg:h-56"
                    src={item.image}
                    alt={item.title}
                  />

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <h5 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h5>
                    <p className="mb-3 line-clamp-3 text-gray-700 dark:text-gray-400">
                      {item.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold">${item.price}</span>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default MyWishlist;

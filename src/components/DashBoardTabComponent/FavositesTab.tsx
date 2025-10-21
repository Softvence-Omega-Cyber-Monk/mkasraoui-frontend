// import p1 from "@/assets/favosites-p1.jpg";
// import p2 from "@/assets/favosites-p2.png";
// import p3 from "@/assets/favosites-p3.png";

// function FavositesTab() {
//   const boxes = [
//     {
//       id: 1,
//       imageSrc: p1,
//       imageAlt: "Smiling child at a birthday party",
//       title: "Superhero Adventure Box",
//       category: "Superhero",
//       price: "$49.99",
//     },
//     {
//       id: 2,
//       imageSrc: p2,
//       imageAlt: "Girl dressed as a princess at a birthday party",
//       title: "Princess Magical Kingdom",
//       category: "Superhero",
//       price: "$49.99",
//     },
//     {
//       id: 3,
//       imageSrc: p3,
//       imageAlt: "Birthday party by a swimming pool",
//       title: "Space Explorer Mission",
//       category: "Superhero",
//       price: "$49.99",
//     },
//     {
//       id: 4,
//       imageSrc: p3,
//       imageAlt: "Birthday party by a swimming pool",
//       title: "Space Explorer Mission",
//       category: "Superhero",
//       price: "$49.99",
//     },
//   ];
//   return (
//     <div>
//       <div className="container mx-auto rounded-2xl border border-[#E6E6E6] bg-white p-6">
//         <h2 className="mb-6 text-2xl font-bold">Favorite Boxes</h2>
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {boxes.map((box) => (
//             <div
//               key={box.id}
//               className="flex h-full flex-col overflow-hidden rounded-xl bg-[#FFF7ED]"
//             >
//               <div className="relative h-52 w-full">
//                 <img
//                   src={box.imageSrc || "/placeholder.svg"}
//                   alt={box.imageAlt}
//                   className="h-full w-full rounded-t-xl object-cover"
//                 />
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-[#191919]">
//                   {box.title}
//                 </h3>
//                 <p className="text-sm text-gray-500">{box.category}</p>
//                 <p className="mt-2 text-lg font-bold text-[#223B7D]">
//                   {box.price}
//                 </p>
//               </div>
//               <div className="mt-auto p-6 pt-0">
//                 <button className="bg-secondary hover:bg-secondary-dark inline-flex w-full cursor-pointer items-center justify-center rounded-md py-2 text-base font-medium whitespace-nowrap text-white hover:bg-gray-50">
//                   View
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FavositesTab;

import {
  useGetWishlistQuery,
  useRemoveFromWishlistApiMutation,
  type WishlistItem,
} from "@/redux/features/wishlist/wishlistApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";

function MyWishlist() {
  const { data: wishlist = [], isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistApiMutation();
  const dispatch = useDispatch();

  // The core functionality remains untouched
  const handleAddToCart = async (item: WishlistItem) => {
    dispatch(
      addToCart({
        id: item.prodcut.id,
        title: item.prodcut.title,
        price: item.prodcut.price,
        image: item.prodcut.imges?.[0] || "/placeholder.png",
        discounted_price: item.prodcut.discounted_price,
        quantity: 1,
        imges: item.prodcut.imges?.[0] || "/placeholder.png",
      })
    );
    await removeFromWishlist(item.id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-700">Loading Favorites...</p>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-center text-lg text-gray-700">
          Your wishlist is empty 😢
        </p>
      </div>
    );
  }

  return (
    // Removed dark:bg-gray-900
    <div className="bg-gray-50 py-12 rounded-xl"> 
      <div className="mx-auto px-8">
        {/* Added a title for context */}
        <h2 className="mb-8 text-3xl font-extrabold text-gray-900 tracking-tight">Your Wishlist ({wishlist.length})</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item.id}
              // --- UPDATED CARD DESIGN CLASSES ---
              // Removed dark: classes
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-400"
              // ------------------------------------
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  // --- UPDATED IMAGE CLASSES ---
                  className="h-60 w-full object-cover transition-transform duration-500 hover:scale-105"
                  // -----------------------------
                  src={item.prodcut.imges?.[0] || "/placeholder.png"}
                  alt={item.prodcut.title}
                />
              </div>
              
              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h5 
                    // Removed dark:text-white
                    className="mb-1 line-clamp-2 text-xl font-semibold text-gray-800" 
                  >
                    {item.prodcut.title}
                  </h5>
                  <p 
                    // Removed dark:text-gray-400
                    className="mb-4 text-sm line-clamp-3 text-gray-500" 
                  >
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
                      className="w-full sm:w-auto flex-1 rounded-lg bg-secondary px-4 py-2 text-white font-medium text-sm shadow-md transition-colors duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      // ------------------------------
                    >
                      🛒 Add to Cart
                    </button>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      // --- UPDATED BUTTON CLASSES ---
                      className="w-full sm:w-auto rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 border border-red-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
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
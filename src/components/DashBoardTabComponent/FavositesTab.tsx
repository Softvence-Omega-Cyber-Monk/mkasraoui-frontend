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
} from "@/redux/features/wishlist/wishlistApi";
import type {
  WishlistItem
} from "@/redux/features/wishlist/wishlistApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";

function MyWishlist() {
  const { data: wishlist = [], isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistApiMutation();
  const dispatch = useDispatch();

  const handleAddToCart = async (item: WishlistItem) => {
    dispatch(
      addToCart({
        id: item.prodcut.id,
        title: item.prodcut.title,
        price: item.prodcut.price,
        image: item.prodcut.imges?.[0] || "/placeholder.png",
        quantity: 1,
      })
    );
    await removeFromWishlist(item.id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Loading wishlist...</p>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          Your wishlist is empty 😢
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <img
                className="h-64 w-full rounded-t-lg object-cover md:h-48 lg:h-56"
                src={item.prodcut.imges?.[0] || "/placeholder.png"}
                alt={item.prodcut.title}
              />
              <div className="flex flex-1 flex-col justify-between p-4">
                <h5 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                  {item.prodcut.title}
                </h5>
                <p className="mb-3 line-clamp-3 text-gray-700 dark:text-gray-400">
                  {item.prodcut.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-lg font-bold">${item.prodcut.price}</span>
                </div>
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

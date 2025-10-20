// // src/components/MyCart.tsx
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import { removeFromCart, updateQuantity } from "@/redux/features/cart/cartSlice";
// import { Link } from "react-router-dom";
// import { useGetMeQuery } from "@/redux/features/user/userApi";

// function MyCart() {
//   const cart = useAppSelector((state) => state.cart.items);
//   console.log(cart)
//   const dispatch = useAppDispatch();
//   const {data} = useGetMeQuery();
//   const isSubscribed = data?.subscription?.length ? true : false;

//   // Calculate subtotals for both original and discounted prices
//   const calculateOriginalSubtotal = () => {
//     return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   };

//   const calculateDiscountedSubtotal = () => {
//     return cart.reduce((acc, item) => {
//       const price = item.discounted_price || item.price;
//       return acc + price * item.quantity;
//     }, 0);
//   };

//   const originalSubtotal = calculateOriginalSubtotal();
//   const discountedSubtotal = calculateDiscountedSubtotal();
//   const shipping = isSubscribed ? 0 : 2.00;
//   const tax = 0;
//   const subtotal = isSubscribed ? discountedSubtotal : originalSubtotal;
//   const total = subtotal + shipping + tax;

//   return (
//     <div>
//       <div className="mx-auto max-w-5xl p-4 max-lg:max-w-2xl">
//         <h1 className="text-xl font-semibold text-slate-900">My Cart</h1>
//         {isSubscribed && (
//           <div className="mt-2 rounded-md bg-green-50 border border-green-200 px-3 py-2">
//             <p className="text-sm text-green-700 font-medium">
//               🎉 Subscription Active: Enjoy discounted prices and free shipping!
//             </p>
//           </div>
//         )}
//         <div className="mt-6 grid gap-x-6 gap-y-8 lg:grid-cols-3 lg:gap-x-8">
//           <div className="space-y-6 lg:col-span-2">
//             {cart.length === 0 && (
//               <p className="text-gray-500">Your cart is empty.</p>
//             )}
//             {cart.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex gap-4 rounded-md border border-gray-200 bg-white px-4 py-6 shadow-sm"
//               >
//                 <div className="flex gap-6 max-sm:flex-col sm:gap-4">
//                   <div className="h-24 w-24 shrink-0 max-sm:h-24 max-sm:w-24">
//                     <img
//                       src={item.image || "/placeholder.png"}
//                       alt={item.title}
//                       className="h-full w-full object-contain"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <div>
//                       <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
//                         {item.title}
//                       </h3>
//                       <h2>{item.rating}</h2>
//                     </div>
//                     <div className="mt-auto">
//                       {isSubscribed ? (
//                         <div className="flex items-center gap-2">
//                           <h3 className="text-sm line-through text-gray-400">
//                             ${(item.price * item.quantity).toFixed(2)}
//                           </h3>
//                           <h3 className="text-sm font-semibold text-green-600">
//                             ${((item.discounted_price ?? item.price) * item.quantity).toFixed(2)}
//                           </h3>
//                           {item.discounted_price && (
//                             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                               SAVE {(((item.price - item.discounted_price) / item.price) * 100).toFixed(0)}%
//                             </span>
//                           )}
//                         </div>
//                       ) : (
//                         <h3 className="text-sm font-semibold text-slate-900">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </h3>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="ml-auto flex flex-col justify-between">
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() =>
//                         dispatch(
//                           updateQuantity({
//                             id: item.id,
//                             quantity: item.quantity - 1,
//                           })
//                         )
//                       }
//                       disabled={item.quantity <= 1}
//                       className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-slate-400 text-white"
//                     >
//                       -
//                     </button>
//                     <span className="text-base font-semibold">
//                       {item.quantity}
//                     </span>
//                     <button
//                       onClick={() =>
//                         dispatch(
//                           updateQuantity({
//                             id: item.id,
//                             quantity: item.quantity + 1,
//                           })
//                         )
//                       }
//                       className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-slate-800 text-white"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => dispatch(removeFromCart(item.id))}
//                     className="mt-2 cursor-pointer text-sm text-red-600 hover:text-red-800"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="h-max rounded-md border border-gray-200 bg-white px-4 py-6 shadow-sm">
//             <ul className="space-y-4 font-medium text-slate-500">
//               <li className="flex justify-between text-sm">
//                 Subtotal{" "}
//                 <span className="font-semibold">
//                   {isSubscribed ? (
//                     <div className="flex items-center gap-2">
//                       <span className="line-through text-gray-400">
//                         ${originalSubtotal.toFixed(2)}
//                       </span>
//                       <span className="text-green-600">
//                         ${discountedSubtotal.toFixed(2)}
//                       </span>
//                     </div>
//                   ) : (
//                     <span className="text-slate-900">${originalSubtotal.toFixed(2)}</span>
//                   )}
//                 </span>
//               </li>
//               <li className="flex justify-between text-sm">
//                 Shipping{" "}
//                 <span className="font-semibold">
//                   {isSubscribed ? (
//                     <div className="flex items-center gap-2">
//                       <span className="line-through text-gray-400">$2.00</span>
//                       <span className="text-green-600">FREE</span>
//                     </div>
//                   ) : (
//                     <span className="text-slate-900">$2.00</span>
//                   )}
//                 </span>
//               </li>
//               <li className="flex justify-between text-sm">
//                 Tax <span className="font-semibold text-slate-900">$4.00</span>
//               </li>
//               <hr className="border-slate-300" />
//               <li className="flex justify-between text-sm font-semibold text-slate-900">
//                 Total{" "}
//                 <span>
//                   {isSubscribed ? (
//                     <div className="flex items-center gap-2">
//                       <span className="line-through text-gray-400">
//                         ${(originalSubtotal + 2 + 4).toFixed(2)}
//                       </span>
//                       <span className="text-green-600">
//                         ${total.toFixed(2)}
//                       </span>
//                     </div>
//                   ) : (
//                     <span>${total.toFixed(2)}</span>
//                   )}
//                 </span>
//               </li>
//               {isSubscribed && (
//                 <li className="text-xs text-green-600 text-center">
//                   You saved ${((originalSubtotal - discountedSubtotal) + 2).toFixed(2)} with your subscription!
//                 </li>
//               )}
//             </ul>
//             <div className="mt-8 space-y-4 flex flex-col">
//               <Link to={`/home/checkout`} className="mb-3">
//                 <button className="w-full cursor-pointer rounded-md bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900">
//                   Buy Now
//                 </button>
//               </Link>
//               <Link to="/home/shop">
//                 <button className="w-full cursor-pointer rounded-md border border-gray-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100">
//                   Continue Shopping
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MyCart;














import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { removeFromCart, updateQuantity } from "@/redux/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "@/redux/features/user/userApi";

function MyCart() {
  const cart = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const { data } = useGetMeQuery();
  const navigate = useNavigate();
  const isSubscribed = data?.subscription?.length ? true : false;

  const calculateOriginalSubtotal = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const calculateDiscountedSubtotal = () =>
    cart.reduce((acc, item) => acc + (item.discounted_price || item.price) * item.quantity, 0);

  const originalSubtotal = calculateOriginalSubtotal();
  const discountedSubtotal = calculateDiscountedSubtotal();
  const shipping = isSubscribed ? 0 : 2.0;
  const tax = 0;
  const subtotal = isSubscribed ? discountedSubtotal : originalSubtotal;
  const total = subtotal + shipping + tax;

  const handleBuyNow = () => {
    // Pass the current cart as directBuy
    navigate("/home/checkout", { state: { directBuy: cart } });
  };

  return (
    <div>
      <div className="mx-auto max-w-5xl p-4 max-lg:max-w-2xl">
        <h1 className="text-xl font-semibold text-slate-900">My Cart</h1>
        {isSubscribed && (
          <div className="mt-2 rounded-md bg-green-50 border border-green-200 px-3 py-2">
            <p className="text-sm text-green-700 font-medium">
              🎉 Subscription Active: Enjoy discounted prices and free shipping!
            </p>
          </div>
        )}
        <div className="mt-6 grid gap-x-6 gap-y-8 lg:grid-cols-3 lg:gap-x-8">
          <div className="space-y-6 lg:col-span-2">
            {cart.length === 0 && <p className="text-gray-500">Your cart is empty.</p>}
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-md border border-gray-200 bg-white px-4 py-6 shadow-sm"
              >
                <div className="flex gap-6 max-sm:flex-col sm:gap-4">
                  <div className="h-24 w-24 shrink-0 max-sm:h-24 max-sm:w-24">
                    <img src={item.image || "/placeholder.png"} alt={item.title} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{item.title}</h3>
                      <h2>{item.rating}</h2>
                    </div>
                    <div className="mt-auto">
                      {isSubscribed ? (
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm line-through text-gray-400">
                            €{(item.price * item.quantity).toFixed(2)}
                          </h3>
                          <h3 className="text-sm font-semibold text-green-600">
                            €{((item.discounted_price ?? item.price) * item.quantity).toFixed(2)}
                          </h3>
                          {item.discounted_price && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              SAVE {(((item.price - item.discounted_price) / item.price) * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <h3 className="text-sm font-semibold text-slate-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </h3>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                      }
                      disabled={item.quantity <= 1}
                      className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-slate-400 text-white"
                    >
                      -
                    </button>
                    <span className="text-base font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                      }
                      className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-slate-800 text-white"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="mt-2 cursor-pointer text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-max rounded-md border border-gray-200 bg-white px-4 py-6 shadow-sm">
            <ul className="space-y-4 font-medium text-slate-500">
              <li className="flex justify-between text-sm">
                Subtotal{" "}
                <span className="font-semibold">
                  {isSubscribed ? (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-400">€{originalSubtotal.toFixed(2)}</span>
                      <span className="text-green-600">€{discountedSubtotal.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-slate-900">€{originalSubtotal.toFixed(2)}</span>
                  )}
                </span>
              </li>
              <li className="flex justify-between text-sm">
                Shipping{" "}
                <span className="font-semibold">
                  {isSubscribed ? (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-400">€2.00</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                  ) : (
                    <span className="text-slate-900">€2.00</span>
                  )}
                </span>
              </li>
              <li className="flex justify-between text-sm">
                Tax <span className="font-semibold text-slate-900">€4.00</span>
              </li>
              <hr className="border-slate-300" />
              <li className="flex justify-between text-sm font-semibold text-slate-900">
                Total{" "}
                <span>
                  {isSubscribed ? (
                    <div className="flex items-center gap-2">
                      <span className="line-through text-gray-400">€{(originalSubtotal + 2 + 4).toFixed(2)}</span>
                      <span className="text-green-600">€{total.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span>€{total.toFixed(2)}</span>
                  )}
                </span>
              </li>
              {isSubscribed && (
                <li className="text-xs text-green-600 text-center">
                  You saved €{((originalSubtotal - discountedSubtotal) + 2).toFixed(2)} with your subscription!
                </li>
              )}
            </ul>

            <div className="mt-8 space-y-4 flex flex-col">
              <button
                onClick={handleBuyNow}
                className="w-full cursor-pointer rounded-md bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900"
              >
                Buy Now
              </button>
              <Link to="/home/shop">
                <button className="w-full cursor-pointer rounded-md border border-gray-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCart;

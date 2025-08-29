import { useCartStore } from "@/store/useUserStore";

function MyCart() {
  const cart = useCartStore((state) => state.cart);
  console.log("my store card", cart);
  return (
    <div>
      <div className="mx-auto max-w-5xl p-4 max-lg:max-w-2xl">
        <h1 className="text-xl font-semibold text-slate-900">Shopping Cart</h1>
        <div className="mt-6 grid gap-x-6 gap-y-8 lg:grid-cols-3 lg:gap-x-8">
          <div className="space-y-6 lg:col-span-2">
            {cart.length === 0 && (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-md border border-gray-200 bg-white px-4 py-6 shadow-sm"
              >
                <div className="flex gap-6 max-sm:flex-col sm:gap-4">
                  <div className="h-24 w-24 shrink-0 max-sm:h-24 max-sm:w-24">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                        {item.title}
                      </h3>
                      <h2>{item.rating}</h2>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-sm font-semibold text-slate-900">
                        ${item.price.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        useCartStore
                          .getState()
                          .updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-slate-400 text-white"
                    >
                      -
                    </button>
                    <span className="text-base font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        useCartStore
                          .getState()
                          .updateQuantity(item.id, item.quantity + 1)
                      }
                      className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-slate-800 text-white"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      useCartStore.getState().removeFromCart(item.id)
                    }
                    className="mt-2 cursor-pointer text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-max rounded-md border border-gray-200 bg-white px-4 py-6 shadow-sm">
            <ul className="space-y-4 font-medium text-slate-500">
              <li className="flex justify-between text-sm">
                Subtotal{" "}
                <span className="font-semibold text-slate-900">
                  $
                  {cart
                    .reduce((acc, i) => acc + i.price * i.quantity, 0)
                    .toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between text-sm">
                Shipping{" "}
                <span className="font-semibold text-slate-900">$2.00</span>
              </li>
              <li className="flex justify-between text-sm">
                Tax <span className="font-semibold text-slate-900">$4.00</span>
              </li>
              <hr className="border-slate-300" />
              <li className="flex justify-between text-sm font-semibold text-slate-900">
                Total{" "}
                <span>
                  $
                  {(
                    cart.reduce((acc, i) => acc + i.price * i.quantity, 0) +
                    2 +
                    4
                  ).toFixed(2)}
                </span>
              </li>
            </ul>
            <div className="mt-8 space-y-4">
              <button className="w-full cursor-pointer rounded-md bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900">
                Buy Now
              </button>
              <button className="w-full cursor-pointer rounded-md border border-gray-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-100">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCart;

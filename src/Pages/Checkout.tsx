import type React from "react";

import { useState } from "react";
import {
  ArrowLeft,
  Truck,
  Shield,
  MapPin,
  User,
  Mail,
  Phone,
  AlertCircle,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { Link, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "@/redux/features/checkout/checkoutApi";

// 2. Define the structure for the form data state
interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  additionalNotes: string;
  agreeToTerms: boolean;
}

// 3. Define the structure for the errors state
interface FormErrors {
  [key: string]: string | undefined; // Allows any string key for field names
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  agreeToTerms?: string;
}

function CheckoutPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const cart = cartItems;
  const { data } = useGetMeQuery();
  const isSubscribed = data?.subscription?.length ? true : false;
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();

  // Form states
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    additionalNotes: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate subtotals for both original and discounted prices
  const calculateOriginalSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const calculateDiscountedSubtotal = () => {
    return cart.reduce((acc, item) => {
      const price = item.discounted_price || item.price;
      return acc + price * item.quantity;
    }, 0);
  };

  const originalSubtotal = calculateOriginalSubtotal();
  const discountedSubtotal = calculateDiscountedSubtotal();

  // Calculate totals based on subscription status
  const subtotal = isSubscribed ? discountedSubtotal : originalSubtotal;
  const shippingFee = isSubscribed ? 0 : subtotal > 50 ? 0 : 5.99; // Free shipping for subscribers or orders over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingFee + tax;

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mb-6 text-gray-600">
            Add some DIY boxes to your cart before checkout
          </p>
          <button
            onClick={() => {
              navigate("/home/shop");
            }}
            className="rounded-lg bg-[#223B7D] px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    // Type guard to check if the target is an input element with a checked property
    const isCheckboxInput =
      e.target instanceof HTMLInputElement && type === "checkbox";
    const checked = isCheckboxInput
      ? (e.target as HTMLInputElement).checked
      : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state) {
      newErrors.state = "Please select a state";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    console.log(formData);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: String(item.id),
          quantity: item.quantity,
        })),
        totalPrice: discountedSubtotal ?? originalSubtotal,
        shippingFee: shippingFee,
        shippingInfo: {
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          address: formData.address,
        },
        additionalNotes: formData.additionalNotes,
      };

      const res = await createOrder(orderPayload).unwrap();

      if (res.success) {
        console.log("✅ Order Created:", res.data);
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      console.error("❌ Checkout Failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-row-reverse justify-between gap-4">
          <button
            onClick={() => {
              /* navigate('/cart') */
            }}
            className="flex items-center gap-2 text-[#223B7D] hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <Link to="/home/my-cart">
              <span>Back to Cart</span>
            </Link>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Checkout
            </h1>
            <p className="text-gray-600">Complete your order</p>
            {isSubscribed && (
              <div className="mt-2 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                <p className="text-sm font-medium text-green-700">
                  🎉 Subscription Active: Enjoy discounted prices and free
                  shipping!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipping Information Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Truck className="h-5 w-5" />
                Shipping Information
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <User className="mr-1 inline h-4 w-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-[#223B7D] ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <Mail className="mr-1 inline h-4 w-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-[#223B7D] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <Phone className="mr-1 inline h-4 w-4" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-[#223B7D] ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <MapPin className="mr-1 inline h-4 w-4" />
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-[#223B7D] ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your complete address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-[#223B7D] ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-[#223B7D] ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="AL">Alabama</option>
                    <option value="CA">California</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    {/* Add more states as needed */}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-[#223B7D] ${
                      errors.zipCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter ZIP code"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-[#223B7D]"
                    placeholder="Any special delivery instructions..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#223B7D] focus:ring-[#223B7D]"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I agree to the{" "}
                      <span className="cursor-pointer text-[#223B7D] underline">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="cursor-pointer text-[#223B7D] underline">
                        Privacy Policy
                      </span>{" "}
                      *
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Package className="h-5 w-5" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="mb-6 max-h-60 space-y-3 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                  >
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title}
                        className="h-full w-full rounded object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <div className="text-sm text-gray-600">
                        <div>Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {isSubscribed ? (
                        <div className="text-right">
                          <div className="text-xs text-gray-400 line-through">
                            €{(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-green-600">
                            €
                            {(
                              (item.discounted_price || item.price) *
                              item.quantity
                            ).toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cart.length} items)
                  </span>
                  <span className="font-semibold">
                    {isSubscribed ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through">
                          €{originalSubtotal.toFixed(2)}
                        </span>
                        <span className="text-green-600">
                          €{discountedSubtotal.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-900">
                        €{originalSubtotal.toFixed(2)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {isSubscribed ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through">
                          €5.99
                        </span>
                        <span className="text-green-600">FREE</span>
                      </div>
                    ) : (
                      <span className="text-gray-900">
                        {shippingFee === 0
                          ? "Free"
                          : `$${shippingFee.toFixed(2)}`}
                      </span>
                    )}
                  </span>
                </div>
                {!isSubscribed && shippingFee > 0 && (
                  <div className="rounded bg-blue-50 p-2 text-xs text-blue-600">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span>
                    {isSubscribed ? (
                      <div className="flex items-center gap-2">
                        <span className="text-base text-gray-400 line-through">
                          €
                          {(
                            originalSubtotal +
                            (originalSubtotal < 50 ? 5.99 : 0) +
                            originalSubtotal * 0.08
                          ).toFixed(2)}
                        </span>
                        <span className="text-[#223B7D]">
                          €{total.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#223B7D]">
                        ${total.toFixed(2)}
                      </span>
                    )}
                  </span>
                </div>
                {isSubscribed && (
                  <div className="rounded bg-green-50 p-2 text-center text-xs text-green-600">
                    You saved €
                    {(
                      originalSubtotal -
                      discountedSubtotal +
                      (originalSubtotal < 50 ? 5.99 : 0)
                    ).toFixed(2)}{" "}
                    with your subscription!
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full cursor-pointer rounded-lg px-4 py-3 font-semibold transition-colors ${
                  isProcessing
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-[#223B7D] hover:bg-[#0b2672]"
                } flex items-center justify-center gap-2 text-white`}
              >
                {isProcessing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Proceed to Payment
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  Secure checkout powered by Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

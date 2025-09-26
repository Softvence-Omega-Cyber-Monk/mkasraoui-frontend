"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Truck, Shield, MapPin, User, Mail, Phone, AlertCircle, Package } from "lucide-react"
import toast from "react-hot-toast"

// Mock cart data - replace with your actual cart state management
const mockCartItems = [
  {
    id: "1",
    title: "DIY Electronics Kit",
    price: 29.99,
    quantity: 2,
    image: "/electronics-kit.jpg",
  },
  {
    id: "2",
    title: "Woodworking Starter Set",
    price: 45.0,
    quantity: 1,
    image: "/woodworking-tools.jpg",
  },
]

// 2. Define the structure for the form data state
interface CheckoutFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  additionalNotes: string
  agreeToTerms: boolean
}

// 3. Define the structure for the errors state
interface FormErrors {
  [key: string]: string | undefined // Allows any string key for field names
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  agreeToTerms?: string
}

function CheckoutPage() {
  const cart = mockCartItems

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
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingFee = subtotal > 50 ? 0 : 5.99 // Free shipping over $50
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shippingFee + tax

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some DIY boxes to your cart before checkout</p>
          <button
            onClick={() => {
              /* navigate('/home/diyboxes') */
            }}
            className="bg-[#223B7D] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse DIY Boxes
          </button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    // Type guard to check if the target is an input element with a checked property
    const isCheckboxInput = e.target instanceof HTMLInputElement && type === "checkbox"
    const checked = isCheckboxInput ? (e.target as HTMLInputElement).checked : false

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Street address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state) {
      newErrors.state = "Please select a state"
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    try {
      // Prepare data for API
      const checkoutData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        totalPrice: Number.parseFloat(total.toFixed(2)),
        shippingFee: Number.parseFloat(shippingFee.toFixed(2)),
        shippingInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          address: formData.address,
        },
        additionalNotes: formData.additionalNotes || "",
      }

      console.log("Checkout data to be sent:", checkoutData)

      // Here you would call your checkout API
      // const response = await fetch('/api/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(checkoutData)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // After successful API call, you would typically:
      // 1. Get Stripe session URL from response
      // 2. Clear cart
      // 3. Redirect to Stripe

      // For demo purposes:
      toast.success("Redirecting to payment...")

      // window.location.href = stripeSessionUrl; // Redirect to Stripe
      alert(`Order data prepared successfully! In production, this would redirect to Stripe with session data.`)
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("There was an error processing your order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => {
              /* navigate('/cart') */
            }}
            className="flex items-center gap-2 text-[#223B7D] hover:text-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Checkout</h1>
            <p className="text-gray-600">Complete your DIY box order</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipping Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#223B7D] focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#223B7D] focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#223B7D] focus:border-transparent ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#223B7D] focus:border-transparent ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your complete address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#223B7D] focus:border-transparent ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#223B7D] focus:border-transparent ${
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
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#223B7D] focus:border-transparent ${
                      errors.zipCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter ZIP code"
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223B7D] focus:border-transparent"
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
                      className="h-4 w-4 text-[#223B7D] border-gray-300 rounded focus:ring-[#223B7D] mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I agree to the <span className="text-[#223B7D] underline cursor-pointer">Terms of Service</span>{" "}
                      and <span className="text-[#223B7D] underline cursor-pointer">Privacy Policy</span> *
                    </span>
                  </label>
                  {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                {shippingFee > 0 && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#223B7D]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-[#223B7D] hover:bg-blue-700"
                } text-white flex items-center justify-center gap-2`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
  )
}

export default CheckoutPage

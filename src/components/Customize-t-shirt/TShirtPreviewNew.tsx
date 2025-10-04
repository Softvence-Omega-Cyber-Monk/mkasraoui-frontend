import React, { useState } from "react";
import {
  useCreateCustomOrderMutation,
} from "@/redux/features/tshirtOrder/tshirtOrderApi";
import type { TshirtOrderRequest } from "@/redux/types/tshirtOrder.type";

interface TShirtPreviewProps {
  tShirtDesign: string;
  tShirtMockup: string;
  colors: { name: string; bg: string; border: string }[];
  selectedColor: string;
  uploadedImage: string | null;
  selectedTheme: { id: string; name: string; icon: string }[];
  selectedThemeId: string;
  childName: string;
  age: string;
  optionalMessage: string;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  tshirtType: string;
  size: string;
  gender: string;
  theme: string;
}

const TShirtPreviewNew: React.FC<TShirtPreviewProps> = ({
  tShirtDesign,
  tShirtMockup,
  selectedColor,
  uploadedImage,
  selectedTheme,
  selectedThemeId,
  childName,
  age,
  optionalMessage,
  quantity,
  setQuantity,
  tshirtType,
  size,
  gender,
  theme,
}) => {
  const unitPrice = 12.9;
  const shippingFee = 5;

  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [createCustomOrder, { isLoading, isSuccess, isError }] =
    useCreateCustomOrderMutation();

  const handleOrder = async () => {
    const orderData : TshirtOrderRequest  = {
      tShirtType: tshirtType,
      size,
      gender,
      color: selectedColor,
      Age: age,
      theme,
      name: childName,
      age,
      optionalMessage,
      quantity,
      designUrl: tShirtDesign,
      mockupUrl: tShirtMockup,
      shippingFee,
      total: quantity * unitPrice + shippingFee,
      address,
      zipCode,
      city,
      state,
      contactName,
      contactPhone,
    };

    try {
      await createCustomOrder(orderData).unwrap();
      alert("✅ Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order.");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
        Live Preview
      </h3>

      {/* Preview Section */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-4 justify-center">
        {/* Design Image */}
        <div className="rounded-lg bg-gradient-to-b from-blue-100 to-blue-200 p-4 text-center relative">
          <div className="relative inline-block">
            <img
              src={tShirtDesign}
              alt="T-shirt design"
              className="h-80 w-64 object-contain"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <div className="flex h-42 w-42 flex-col items-center justify-center rounded-lg bg-transparent p-2">
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Uploaded design"
                    className="mb-1 h-16 w-16 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">Design Preview</div>
        </div>

        {/* Mockup Image */}
        <div className="rounded-lg bg-gradient-to-b from-blue-100 to-blue-200 p-4 text-center relative">
          <div className="relative inline-block">
            <img
              src={tShirtMockup}
              alt="T-shirt mockup"
              className="h-80 w-64 object-contain"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <div className="flex h-42 w-42 flex-col items-center justify-center rounded-lg bg-transparent p-2">
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Uploaded design"
                    className="mb-1 h-16 w-16 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">Mockup Preview</div>
        </div>

      </div>

      {/* Quantity & Price */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              -
            </button>
            <span className="border-x border-gray-300 px-4 py-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              +
            </button>
          </div>
        </div>
        <div className="text-xl font-bold text-gray-800">
          €{(unitPrice * quantity + shippingFee).toFixed(2)}
        </div>
      </div>

      {/* Shipping Form */}
      <div className="bg-gray-100 p-4 rounded-xl space-y-3">
        <h4 className="font-semibold text-gray-700 mb-2">Shipping Information</h4>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-gray-50 rounded px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-gray-50 rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full bg-gray-50 rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full bg-gray-50 rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Contact Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full bg-gray-50 rounded px-3 py-2 text-sm"
          />
        </div>
        <input
          type="text"
          placeholder="Contact Phone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="w-full bg-gray-50 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleOrder}
        disabled={isLoading}
        className="hover:bg-secondary-light mx-auto mt-4 flex w-[70%] items-center justify-center gap-2 rounded-lg bg-[#223B7D] py-2 text-lg text-white transition-colors disabled:opacity-50"
      >
        {isLoading ? "Processing..." : `Order Now - €${(unitPrice * quantity + shippingFee).toFixed(2)}`}
      </button>

      {isSuccess && (
        <p className="text-green-600 text-center mt-2">Order placed successfully!</p>
      )}
      {isError && (
        <p className="text-red-600 text-center mt-2">Failed to place order.</p>
      )}
    </div>
  );
};

export default TShirtPreviewNew;

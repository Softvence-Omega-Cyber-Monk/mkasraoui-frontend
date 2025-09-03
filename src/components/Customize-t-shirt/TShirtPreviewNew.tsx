import React from "react";

interface TShirtPreviewProps {
  tShirt: string;
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
}

const TShirtPreviewNew: React.FC<TShirtPreviewProps> = ({
  tShirt,
  colors,
  selectedColor,
  uploadedImage,
  selectedTheme,
  selectedThemeId,
  childName,
  age,
  optionalMessage,
  quantity,
  setQuantity,
}) => {
  const unitPrice = 12.9;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
          Live Preview
        </h3>

        {/* Main Preview */}
        <div className="rounded-lg bg-gradient-to-b from-blue-100 to-blue-200 p-8 text-center">
          <div className="relative inline-block">
            {/* Color overlay for t-shirt */}
            <div className="relative">
              <img
                src={tShirt}
                alt="T-shirt preview"
                className="h-80 w-64 object-contain"
              />
              {selectedColor !== "white" && (
                <div
                  className={`absolute inset-0 h-80 w-64 ${
                    colors.find((c) => c.name === selectedColor)?.bg
                  } opacity-60 mix-blend-multiply`}
                  style={{
                    maskImage: `url(${tShirt})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: `url(${tShirt})`,
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                  }}
                />
              )}
            </div>

            {/* Design Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <div className="flex h-42 w-42 flex-col items-center justify-center rounded-lg bg-transparent p-2">
                {uploadedImage && (
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded design"
                    className="mb-1 h-16 w-16 object-contain"
                  />
                )}

                {!uploadedImage && (
                  <div className="mb-1 text-5xl">
                    {selectedTheme.find((theme) => theme.id === selectedThemeId)
                      ?.icon || "🦄"}
                  </div>
                )}

                {childName && (
                  <div className="text-center text-xs leading-tight font-bold text-purple-600">
                    {childName}
                  </div>
                )}
                {age && (
                  <div className="text-center text-xs text-purple-500">
                    Age {age}
                  </div>
                )}
                {optionalMessage && (
                  <div className="mt-1 text-center text-xs leading-tight text-gray-600">
                    {optionalMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity and Price */}
      {/* Quantity and Price */}
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
            <span className="border-x border-gray-300 px-4 py-2">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              +
            </button>
          </div>
        </div>
        <div className="text-xl font-bold text-gray-800">
          €{(unitPrice * quantity).toFixed(2)}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button className="hover:bg-secondary-light mx-auto mt-4 flex w-[70%] items-center justify-center gap-2 rounded-lg bg-[#223B7D] py-2 text-lg text-white transition-colors">
        🛒 Add To Cart - €{(unitPrice * quantity).toFixed(2)}
      </button>
    </div>
  );
};

export default TShirtPreviewNew;

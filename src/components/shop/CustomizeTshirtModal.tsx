import imgUp from "@/assets/imgUp.png";
import mUser from "@/assets/m-user.png";
import shopingTrolly from "@/assets/shopping-cart.png";
import { useUserStore } from "@/store/useUserStore";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
interface CustomizeTshirtModalProps {
  product: {
    id: number;
    image: string;
    imageAlt: string;
    title: string;
    description: string;
    rating: number;
    reviews: number;
    currentPrice: string;
    originalPrice: string;
    tags: string[];
    buttonText: string;
    buttonVariant: string;
    tag?: string;
  };
  onClose: () => void;
}

function CustomizeTshirtModal({ product, onClose }: CustomizeTshirtModalProps) {
  const { user } = useUserStore();
  const [tshirtType, setTshirtType] = useState<"child" | "adult">("child");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [selectedColor, setSelectedColor] = useState("white");
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [optionalMessage, setOptionalMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const colors = [
    { name: "white", bg: "bg-white", border: "border-[#ADADAD]" },
    { name: "pink", bg: "bg-pink-300", border: "border-pink-300" },
    { name: "lightblue", bg: "bg-blue-300", border: "border-blue-300" },
    { name: "yellow", bg: "bg-yellow-300", border: "border-yellow-300" },
    { name: "black", bg: "bg-black", border: "border-black" },
    { name: "blue", bg: "bg-blue-500", border: "border-blue-500" },
  ];

  const themes = [
    { id: "unicorns", label: "🦄 Unicorns" },
    { id: "pirates", label: "🏴‍☠️ Pirates" },
    { id: "princess", label: "👑 Princess" },
    { id: "superheroes", label: "🦸 Superheroes" },
    { id: "jungle", label: "🌿 Jungle" },
    { id: "space", label: "🚀 Space" },
  ];

  // upload img handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  //increment Quantity handler
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  // decrement Quantity handler
  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const totalPrice = (12.9 * quantity).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold md:text-2xl">
              Create Your Personalized Birthday T-Shirt
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-xl text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {/* T-Shirt Type */}
          <div className="mb-8">
            <label className="mb-3 flex items-center text-xl font-medium">
              <span className="mr-2">
                <img src={mUser} alt="" className="h-6 w-6" />
              </span>
              T-Shirt Type
            </label>
            <div className="flex overflow-hidden rounded-lg">
              <button
                onClick={() => setTshirtType("child")}
                className={`flex-1 cursor-pointer px-4 py-3 text-sm font-medium transition-colors ${tshirtType === "child"
                    ? "bg-[#223B7D] text-white"
                    : "bg-[#D4D4D8] text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Child
              </button>
              <button
                onClick={() => setTshirtType("adult")}
                className={`flex-1 cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${tshirtType === "adult"
                    ? "bg-[#223B7D] text-white"
                    : "bg-[#D4D4D8] text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Adult
              </button>
            </div>
          </div>

          {/* Size and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">📏 Size</label>
              <div className="relative">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-[#ADADAD] p-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select size</option>
                  <option value="xs">XS</option>
                  <option value="s">S</option>
                  <option value="m">M</option>
                  <option value="l">L</option>
                  <option value="xl">XL</option>
                  <option value="xxl">XXL</option>
                  <option value="xxxl">XXXL</option>
                  <option value="xs-child">XS (Child)</option>
                  <option value="1y">1 YEAR</option>
                  <option value="2y">2 YEAR</option>
                  <option value="3y">3 YEAR</option>
                </select>

                {/* Custom dropdown icon */}
                <ChevronDown className="pointer-events-none absolute top-[60%] right-3 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500" />
              </div>
            </div>
            <div>
              <label className="mb-2 flex items-center text-sm font-medium">
                <span className="mr-2">
                  <img src={mUser} alt="" className="h-4 w-4" />
                </span>
                Gender
              </label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-[#ADADAD] p-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                </select>

                {/* Custom dropdown icon */}
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="mt-8 mb-6">
            <label className="mb-2 block text-sm font-medium">🎨 Colors</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-8 w-8 cursor-pointer rounded-full border-2 transition-all ${color.bg} ${selectedColor === color.name
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : color.border
                    }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Child's Name and Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Child's Name
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter child's name"
                className="w-full cursor-pointer rounded-lg border border-[#ADADAD] p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Age</label>
              <div className="relative">
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-[#ADADAD] p-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select age</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                {/* Custom icon */}
                <ChevronDown className="pointer-events-none absolute top-[58%] right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="mt-8">
            <label className="mb-4 block text-sm font-medium">🎭 Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`cursor-pointer rounded-lg border border-[#ADADAD] p-3 text-center text-xs transition-colors ${selectedTheme === theme.id
                      ? "border-[#223B7D] bg-blue-100 text-[#223B7D]"
                      : "hover:bg-gray-50"
                    }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-8">
            <label className="mb-4 block text-sm font-medium">
              Add a special image, character, or logo to personalize the T-shirt
              even more.
            </label>
            <div className="mt-8 h-40 cursor-pointer rounded-lg border-2 border-dashed border-[#ADADAD] p-8 text-center transition-colors hover:border-gray-400">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {uploadedImage ? (
                  <div>
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="mx-auto mb-2 h-20 w-20 rounded object-cover"
                    />
                    <p className="text-sm text-green-600">
                      Image uploaded successfully!
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-2 text-2xl text-gray-400">
                      <img src={imgUp} alt="" />
                    </div>
                    <p className="text-sm text-gray-500">+ Select an image</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Optional Message */}
          <div className="mt-10">
            <label className="mb-2 block text-sm font-medium">
              💬 Optional Message
            </label>
            <textarea
              value={optionalMessage}
              onChange={(e) => setOptionalMessage(e.target.value)}
              placeholder="e.g. It's My Party, Team Sofia"
              className="mt-4 h-20 w-full resize-none rounded-lg border border-[#ADADAD] p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Live Preview */}
          <div className="mt-10">
            <h3 className="mb-2 text-sm font-medium">Live Preview</h3>
            <div className="mt-4 rounded-lg bg-blue-100 p-4">
              <img
                src={product.image}
                alt="T-shirt preview"
                className="h-48 w-full rounded-lg object-cover"
              />
              {childName && (
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">
                    Preview for: {childName}
                  </p>
                  {age && <p className="text-xs text-gray-600">Age: {age}</p>}
                  {selectedTheme && (
                    <p className="text-xs text-gray-600">
                      Theme: {selectedTheme}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Options */}
          <div className="flex gap-2">
            <img
              src={product.image}
              alt="Design option 1"
              className="h-12 w-12 cursor-pointer rounded border object-cover hover:border-blue-500"
            />
            <img
              src={product.image}
              alt="Design option 2"
              className="h-12 w-12 cursor-pointer rounded border object-cover hover:border-blue-500"
            />
            <img
              src={product.image}
              alt="Design option 3"
              className="h-12 w-12 cursor-pointer rounded border object-cover hover:border-blue-500"
            />
          </div>

          {/* Quantity and Price */}
          <div className="mt-10 mb-6 flex items-center justify-between">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Quantity:
              </label>
              <div className="mt-4 flex items-center">
                <button
                  onClick={decrementQuantity}
                  className="cursor-pointer rounded-l border px-3 py-1 transition-colors hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="w-16 border-t border-b p-1 text-center focus:outline-none"
                />
                <button
                  onClick={incrementQuantity}
                  className="cursor-pointer rounded-r border px-3 py-1 transition-colors hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">€{totalPrice}</div>
              <div className="text-xs text-gray-500">
                Including VAT and shipping
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              if (!user) {
                // Show toast if not logged in

                if (!user) {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please login first!",
                  });
                  return;
                }

                alert("Please log in to add items to your cart."); // Replace with a toast if using a library
                return;
              }

              // User is logged in – proceed to add to cart
              console.log("Adding to cart:", {
                tshirtType,
                size,
                gender,
                selectedColor,
                childName,
                age,
                selectedTheme,
                uploadedImage,
                optionalMessage,
                quantity,
                totalPrice,
              });

              alert(`Added ${quantity} item(s) to cart for €${totalPrice}`);
            }}

            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#223B7D] py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <img src={shopingTrolly} alt="" className="h-5 w-5" />
            <span>Add To Cart - €{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomizeTshirtModal;

{
  /* Buttons */
}
// <div className="flex justify-end gap-2">
//   <button
//     onClick={onClose}
//     className="px-4 py-2 bg-gray-400 text-white rounded-md"
//   >
//     Cancel
//   </button>
//   <button
//     className="px-4 py-2 bg-green-500 text-white rounded-md"
//   >
//     Save
//   </button>
// </div>

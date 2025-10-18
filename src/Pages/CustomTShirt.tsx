import React, { useState, useEffect } from "react";
import tShirtPlaceholder from "@/assets/t-shirt/white-t-shirt-mockup.png";
import TShirtPreviewNew from "@/components/Customize-t-shirt/TShirtPreviewNew";
import MyHeader from "@/components/MyHeader/MyHeader";
import { useGenerateTShirtMutation } from "@/redux/features/tShirt/tshirtApi";
import toast from "react-hot-toast";


function CustomTShirt() {
  const [tshirtType, setTshirtType] = useState("CHILD");
  const [tshirtProduct, setTshirtProduct] = useState("");
  const [tShirtPrice, setTShirtPrice] = useState(0)
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("UNICORNS");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [optionalMessage, setOptionalMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [tShirtDesign, setTShirtDesign] = useState<string | null>(null);
  const [tShirtMockup, setTShirtMockup] = useState<string | null>(null);

  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const [generateTShirt, { isLoading }] = useGenerateTShirtMutation();

  // T-Shirt Product Options
  const tshirtProducts = [
    { id: "Recycled_Blend_Kids_Sweatshirt", name: "Recycled Blend Kids Sweatshirt", price: 19.6 },
    { id: "Toddler_Cotton_Jersey_TShirt", name: "Toddler Cotton Jersey T-Shirt", price: 15.65 },
    { id: "Ultra_Cotton_Unisex_Crewneck_TShirt", name: "Ultra Cotton Unisex Crewneck T-shirt", price: 15.65 },
    { id: "Premium_Kids_Crewneck_TShirt", name: "Premium Kids Crewneck T-shirt", price: 17.17 },
  ];

  // Dynamic colors and sizes based on product selection
  const productConfigs: {
    [key: string]: {
      colors: Array<{ name: string; bg: string; border: string }>;
      sizes: string[];
    };
  } = {
    Recycled_Blend_Kids_Sweatshirt: {
      colors: [
        { name: "white", bg: "bg-white", border: "border-gray-300" },
        { name: "black", bg: "bg-black", border: "border-black" },
        { name: "creamy pink", bg: "bg-pink-100", border: "border-pink-100" },
        { name: "blue", bg: "bg-blue-400", border: "border-blue-400" },
        { name: "green", bg: "bg-green-500", border: "border-green-500" },
        { name: "bright red", bg: "bg-red-600", border: "border-red-600" },
        { name: "french navy", bg: "bg-blue-900", border: "border-blue-900" },
        { name: "royal blue", bg: "bg-blue-600", border: "border-blue-600" },
      ],
      sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y"],
    },
    Toddler_Cotton_Jersey_TShirt: {
      colors: [
        { name: "white", bg: "bg-white", border: "border-gray-300" },
        { name: "charcoal", bg: "bg-gray-700", border: "border-gray-700" },
        { name: "pink", bg: "bg-pink-300", border: "border-pink-300" },
        { name: "light blue", bg: "bg-blue-200", border: "border-blue-200" },
        { name: "heather", bg: "bg-gray-300", border: "border-gray-300" },
      ],
      sizes: ["2T", "3T", "4T"],
    },
    Ultra_Cotton_Unisex_TShirt: {
      colors: [
        { name: "white", bg: "bg-white", border: "border-gray-300" },
        { name: "black", bg: "bg-black", border: "border-black" },
        { name: "cornsilk", bg: "bg-yellow-100", border: "border-yellow-100" },
        { name: "ash", bg: "bg-gray-300", border: "border-gray-300" },
        { name: "natural", bg: "bg-stone-200", border: "border-stone-200" },
        { name: "light pink", bg: "bg-pink-200", border: "border-pink-200" },
        { name: "sand", bg: "bg-amber-200", border: "border-amber-200" },
        { name: "daisy", bg: "bg-yellow-200", border: "border-yellow-200" },
        { name: "purple", bg: "bg-purple-500", border: "border-purple-500" },
        { name: "navy", bg: "bg-blue-900", border: "border-blue-900" },
        { name: "red", bg: "bg-red-600", border: "border-red-600" },
        { name: "royal", bg: "bg-blue-600", border: "border-blue-600" },
      ],
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    },
    Premium_Kids_Crewneck_TShirt: {
      colors: [
        { name: "white", bg: "bg-white", border: "border-gray-300" },
        { name: "black", bg: "bg-black", border: "border-black" },
        { name: "kelly", bg: "bg-green-600", border: "border-green-600" },
        { name: "ash", bg: "bg-gray-300", border: "border-gray-300" },
        { name: "pink", bg: "bg-pink-300", border: "border-pink-300" },
        { name: "navy", bg: "bg-blue-900", border: "border-blue-900" },
        { name: "maroon", bg: "bg-red-900", border: "border-red-900" },
        { name: "purple", bg: "bg-purple-500", border: "border-purple-500" },
        { name: "berry", bg: "bg-purple-700", border: "border-purple-700" },
        { name: "red", bg: "bg-red-600", border: "border-red-600" },
        { name: "royal", bg: "bg-blue-600", border: "border-blue-600" },
      ],
      sizes: ["S", "M", "L", "XL"],
    },
  };

  // Get current colors and sizes based on selected product
  const currentColors = tshirtProduct && productConfigs[tshirtProduct]
    ? productConfigs[tshirtProduct].colors
    : [];
  const currentSizes = tshirtProduct && productConfigs[tshirtProduct]
    ? productConfigs[tshirtProduct].sizes
    : [];

  // Reset color and size when product changes
  useEffect(() => {
    if (tshirtProduct) {
      setSelectedColor("");
      setSize("");
    }
  }, [tshirtProduct]);

  const themes = [
    { id: "UNICORNS", name: "Unicorns", icon: "🦄" },
    { id: "PIRATES", name: "Pirates", icon: "🏴‍☠️" },
    { id: "PRINCESS", name: "Princess", icon: "👑" },
    { id: "SUPERHERO", name: "Superheroes", icon: "🦸" },
    { id: "JUNGLE", name: "Jungle", icon: "🌿" },
    { id: "SPACE", name: "Space", icon: "🚀" },
  ];

  // Dynamic gender options based on t-shirt type
  const genderOptions = tshirtType === "ADULT" 
    ? ["MALE", "FEMALE"] 
    : ["BOY", "GIRL"];

  const ages = Array.from({ length: 70 }, (_, i) => String(i + 1));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!tshirtProduct) {
      toast.error("Please select a t-shirt product.");
      return;
    }
    if (!size || !gender || !age) {
      toast.error("Please select size, gender, and age before generating.");
      return;
    }
    
    try {
      const response = await generateTShirt({
        t_shirt_type: tshirtType,
        t_shirt_size: size,
        apparel_type: tshirtProduct.replace(/_/g, " "),
        gender,
        t_shirt_color: selectedColor,
        age: parseInt(age, 10),
        t_shirt_theme: selectedTheme,
        optional_description: optionalMessage || undefined,
        img_file: uploadedFile || null,
      }).unwrap();

      console.log(response);

      setTShirtDesign(response.generated_design_url);
      setTShirtMockup(response.generated_mockup_url);
    } catch (err) {
      console.error("Error generating t-shirt:", err);
      toast.error("Failed to generate t-shirt. Please try again.");
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
        </div>
      )}

      <MyHeader
        title="Custom T-Shirt Designer"
        subtitle="Create unique, personalized t-shirts for your child's special day. Choose from our collection of themes and make it truly memorable!"
        className="text-3xl sm:text-5xl md:text-6xl"
      />

      <div className="container mx-auto -mt-20 bg-white p-6">
        <h1 className="mb-14 text-center text-2xl font-bold text-gray-800">
          Create Your Personalized Birthday T-Shirt
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Customization Options */}
          <div className="space-y-6">
            {/* T-Shirt Product Selection */}
            <div>
              <div className="mb-3 flex items-center">
                <span className="mr-2 text-sm text-gray-600">👕</span>
                <span className="text-sm font-medium text-gray-700">
                  Select T-Shirt Product
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowProductDropdown(!showProductDropdown)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600 hover:border-gray-400"
                >
                  {tshirtProduct 
                    ? tshirtProducts.find(p => p.id === tshirtProduct)?.name 
                    : "Select a product"}
                  <span className="float-right">▼</span>
                </button>
                {showProductDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
                    {tshirtProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setTshirtProduct(product.id);
                          setTShirtPrice(product.price);
                          setShowProductDropdown(false);
                        }}
                        className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* T-Shirt Type */}
            <div>
              <div className="mb-3 flex items-center">
                <span className="mr-2 text-sm text-gray-600">👤</span>
                <span className="text-sm font-medium text-gray-700">
                  T-Shirt Type
                </span>
              </div>
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => {
                    setTshirtType("CHILD");
                    setGender("");
                  }}
                  className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    tshirtType === "CHILD" 
                      ? "bg-[#223B7D] text-white" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Child
                </button>
                <button
                  onClick={() => {
                    setTshirtType("ADULT");
                    setGender("");
                  }}
                  className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    tshirtType === "ADULT" 
                      ? "bg-[#223B7D] text-white" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Adult
                </button>
              </div>
            </div>

            {/* Size & Gender */}
            <div className="grid grid-cols-2 gap-4">
              {/* Size */}
              <div>
                <div className="mb-2 flex items-center">
                  <span className="mr-2 text-sm text-gray-600">📏</span>
                  <span className="text-sm font-medium text-gray-700">Size</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                    disabled={!tshirtProduct}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {size || (tshirtProduct ? "Select a size" : "Select product first")}
                    <span className="float-right">▼</span>
                  </button>
                  {showSizeDropdown && currentSizes.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg max-h-48 overflow-y-auto">
                      {currentSizes.map((sizeOption) => (
                        <button
                          key={sizeOption}
                          onClick={() => {
                            setSize(sizeOption);
                            setShowSizeDropdown(false);
                          }}
                          className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <div className="mb-2 flex items-center">
                  <span className="mr-2 text-sm text-gray-600">⚧</span>
                  <span className="text-sm font-medium text-gray-700">Gender</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600"
                  >
                    {gender || "Select"}
                    <span className="float-right">▼</span>
                  </button>
                  {showGenderDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
                      {genderOptions.map((genderOption) => (
                        <button
                          key={genderOption}
                          onClick={() => {
                            setGender(genderOption);
                            setShowGenderDropdown(false);
                          }}
                          className="w-full p-3 text-left text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50"
                        >
                          {genderOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <div className="mb-3 flex items-center">
                <span className="mr-2 text-sm text-gray-600">🎨</span>
                <span className="text-sm font-medium text-gray-700">Colors</span>
              </div>
              {!tshirtProduct ? (
                <p className="text-sm text-gray-500">Please select a t-shirt product first</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {currentColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`h-10 w-10 rounded-full border-2 ${color.bg} ${
                        selectedColor === color.name 
                          ? "ring-2 ring-[#223B7D] ring-offset-2" 
                          : color.border
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Child Name & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child's name"
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowAgeDropdown(!showAgeDropdown)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600"
                  >
                    {age || "Select age"}
                    <span className="float-right">▼</span>
                  </button>
                  {showAgeDropdown && (
                    <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                      {ages.map((ageOption) => (
                        <button
                          key={ageOption}
                          onClick={() => {
                            setAge(ageOption);
                            setShowAgeDropdown(false);
                          }}
                          className="w-full p-3 text-left text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50"
                        >
                          {ageOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Theme */}
            <div>
              <div className="mb-3 flex items-center">
                <span className="mr-2 text-sm text-gray-600">🎭</span>
                <span className="text-sm font-medium text-gray-700">Theme</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`rounded-lg border p-4 text-center transition-all ${
                      selectedTheme === theme.id 
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="mb-1 text-2xl">{theme.icon}</div>
                    <div className="text-xs font-medium">{theme.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <p className="mb-3 text-sm text-gray-600">
                Add a special image, character, or logo to personalize the T-shirt even more.
              </p>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="mx-auto h-32 max-w-full object-contain"
                    />
                  ) : (
                    <>
                      <div className="mb-2 text-4xl text-gray-400">📷</div>
                      <div className="text-sm text-gray-500">+ Select an Image</div>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                📝 Optional Message
              </label>
              <textarea
                value={optionalMessage}
                onChange={(e) => setOptionalMessage(e.target.value)}
                placeholder="e.g. It's My Party Time SOFIA"
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm"
              />
            </div>

            {/* Generate Button */}
            <div className="pt-6">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full rounded-lg bg-[#223B7D] px-6 py-3 font-medium hover:cursor-pointer text-white shadow-md hover:bg-[#1a2d61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Generating..." : "✨ Generate T-Shirt"}
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <TShirtPreviewNew
            tShirtDesign={tShirtDesign || tShirtPlaceholder}
            tShirtMockup={tShirtMockup || tShirtPlaceholder}
            tShirtPrice = {tShirtPrice}
            colors={currentColors}
            selectedColor={selectedColor}
            uploadedImage={uploadedImage}
            selectedTheme={themes}
            selectedThemeId={selectedTheme}
            childName={childName}
            age={age}
            optionalMessage={optionalMessage}
            quantity={quantity}
            setQuantity={setQuantity}
            tshirtType={tshirtType}
            size={size}
            gender={gender}
            theme={selectedTheme}
            tshirtProduct={tshirtProduct}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomTShirt;

// import React, { useState } from "react";
// import tShirtPlaceholder from "@/assets/t-shirt/white-t-shirt-mockup.png";
// import TShirtPreviewNew from "@/components/Customize-t-shirt/TShirtPreviewNew";
// import MyHeader from "@/components/MyHeader/MyHeader";
// import { useGenerateTShirtMutation } from "@/redux/features/tShirt/tshirtApi";

// function CustomTShirt() {
//   const [tshirtType, setTshirtType] = useState("CHILD");
//   const [size, setSize] = useState("");
//   const [gender, setGender] = useState("");
//   const [selectedColor, setSelectedColor] = useState("white");
//   const [childName, setChildName] = useState("");
//   const [age, setAge] = useState("");
//   const [selectedTheme, setSelectedTheme] = useState("unicorns");
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [optionalMessage, setOptionalMessage] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   // Two images from API
//   const [tShirtDesign, setTShirtDesign] = useState<string | null>(null);
//   const [tShirtMockup, setTShirtMockup] = useState<string | null>(null);

//   const [showSizeDropdown, setShowSizeDropdown] = useState(false);
//   const [showGenderDropdown, setShowGenderDropdown] = useState(false);
//   const [showAgeDropdown, setShowAgeDropdown] = useState(false);

//   const [generateTShirt, { isLoading }] = useGenerateTShirtMutation();

//   const colors = [
//     { name: "white", bg: "bg-white", border: "border-gray-300" },
//     { name: "pink", bg: "bg-pink-300", border: "border-pink-300" },
//     { name: "teal", bg: "bg-teal-300", border: "border-teal-300" },
//     { name: "yellow", bg: "bg-yellow-300", border: "border-yellow-300" },
//     { name: "black", bg: "bg-black", border: "border-black" },
//     { name: "lightblue", bg: "bg-blue-200", border: "border-blue-200" },
//   ];

//   const themes = [
//     { id: "UNICORNS", name: "Unicorns", icon: "🦄" },
//     { id: "PIRATES", name: "Pirates", icon: "🏴‍☠️" },
//     { id: "PRINCESS", name: "Princess", icon: "👑" },
//     { id: "SUPERHERO", name: "Superheroes", icon: "🦸" },
//     { id: "JUNGLE", name: "Jungle", icon: "🌿" },
//     { id: "SPACE", name: "Space", icon: "🚀" },
//   ];

//   const sizes = ["S", "M", "L", "XL", "2-3 years", "4-5 years", "6-7 years", "8-9 years", "10-11 years", "12-13 years"];
//   const genders = ["MALE", "FEMALE"];
//   const ages = Array.from({ length: 13 }, (_, i) => String(i + 1));

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setUploadedFile(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setUploadedImage(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!size || !gender || !age) {
//       alert("Please select size, gender, and age before generating.");
//       return;
//     }
//     try {
//       const response = await generateTShirt({
//         t_shirt_type: tshirtType,
//         t_shirt_size: size,
//         gender,
//         t_shirt_color: selectedColor,
//         age: parseInt(age, 10),
//         t_shirt_theme: selectedTheme,
//         optional_description: optionalMessage || undefined,
//         img_file: uploadedFile || null,
//       }).unwrap();

//       console.log(response);

//       setTShirtDesign(response.generated_design_url);
//       setTShirtMockup(response.generated_mockup_url);
//     } catch (err) {
//       console.error("Error generating t-shirt:", err);
//       alert("Failed to generate t-shirt. Please try again.");
//     }
//   };

//   return (
//     <div>
//       {isLoading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//           <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
//         </div>
//       )}

//       <MyHeader
//         title="Custom T-Shirt Designer"
//         subtitle="Create unique, personalized t-shirts for your child's special day. Choose from our collection of themes and make it truly memorable!"
//         className="text-3xl sm:text-5xl md:text-6xl"
//       />

//       <div className="container mx-auto -mt-20 bg-white p-6">
//         <h1 className="mb-14 text-center text-2xl font-bold text-gray-800">
//           Create Your Personalized Birthday T-Shirt
//         </h1>

//         <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
//           {/* Left Column - Customization Options */}
//           <div className="space-y-6">
//             {/* T-Shirt Type */}
//             <div>
//               <div className="mb-3 flex items-center">
//                 <span className="mr-2 text-sm text-gray-600">👕</span>
//                 <span className="text-sm font-medium text-gray-700">
//                   T-Shirt Type
//                 </span>
//               </div>
//               <div className="flex rounded-lg bg-gray-100 p-1">
//                 <button
//                   onClick={() => setTshirtType("CHILD")}
//                   className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
//                     tshirtType === "CHILD" ? "bg-[#223B7D] text-white" : "text-gray-600 hover:text-gray-800"
//                   }`}
//                 >
//                   Child
//                 </button>
//                 <button
//                   onClick={() => setTshirtType("ADULT")}
//                   className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
//                     tshirtType === "ADULT" ? "bg-[#223B7D] text-white" : "text-gray-600 hover:text-gray-800"
//                   }`}
//                 >
//                   Adult
//                 </button>
//               </div>
//             </div>

//             {/* Size & Gender */}
//             <div className="grid grid-cols-2 gap-4">
//               {/* Size */}
//               <div>
//                 <div className="mb-2 flex items-center">
//                   <span className="mr-2 text-sm text-gray-600">📏</span>
//                   <span className="text-sm font-medium text-gray-700">Size</span>
//                 </div>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowSizeDropdown(!showSizeDropdown)}
//                     className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600"
//                   >
//                     {size || "Select a size"}
//                     <span className="float-right">▼</span>
//                   </button>
//                   {showSizeDropdown && (
//                     <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
//                       {sizes.map((sizeOption) => (
//                         <button
//                           key={sizeOption}
//                           onClick={() => {
//                             setSize(sizeOption);
//                             setShowSizeDropdown(false);
//                           }}
//                           className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
//                         >
//                           {sizeOption}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Gender */}
//               <div>
//                 <div className="mb-2 flex items-center">
//                   <span className="mr-2 text-sm text-gray-600">👤</span>
//                   <span className="text-sm font-medium text-gray-700">Gender</span>
//                 </div>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowGenderDropdown(!showGenderDropdown)}
//                     className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600"
//                   >
//                     {gender || "Select"}
//                     <span className="float-right">▼</span>
//                   </button>
//                   {showGenderDropdown && (
//                     <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
//                       {genders.map((genderOption) => (
//                         <button
//                           key={genderOption}
//                           onClick={() => {
//                             setGender(genderOption);
//                             setShowGenderDropdown(false);
//                           }}
//                           className="w-full p-3 text-left text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50"
//                         >
//                           {genderOption}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Colors */}
//             <div>
//               <div className="mb-3 flex items-center">
//                 <span className="mr-2 text-sm text-gray-600">🎨</span>
//                 <span className="text-sm font-medium text-gray-700">Colors</span>
//               </div>
//               <div className="flex gap-3">
//                 {colors.map((color) => (
//                   <button
//                     key={color.name}
//                     onClick={() => setSelectedColor(color.name)}
//                     className={`h-8 w-8 rounded-full border-2 ${color.bg} ${
//                       selectedColor === color.name ? "ring-2 ring-[#223B7D] ring-offset-2" : color.border
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Child Name & Age */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Child's Name
//                 </label>
//                 <input
//                   type="text"
//                   value={childName}
//                   onChange={(e) => setChildName(e.target.value)}
//                   placeholder="Enter child's name"
//                   className="w-full rounded-lg border border-gray-300 p-3 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Age
//                 </label>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowAgeDropdown(!showAgeDropdown)}
//                     className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600"
//                   >
//                     {age || "Select age"}
//                     <span className="float-right">▼</span>
//                   </button>
//                   {showAgeDropdown && (
//                     <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
//                       {ages.map((ageOption) => (
//                         <button
//                           key={ageOption}
//                           onClick={() => {
//                             setAge(ageOption);
//                             setShowAgeDropdown(false);
//                           }}
//                           className="w-full p-3 text-left text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50"
//                         >
//                           {ageOption}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Theme */}
//             <div>
//               <div className="mb-3 flex items-center">
//                 <span className="mr-2 text-sm text-gray-600">🎭</span>
//                 <span className="text-sm font-medium text-gray-700">Theme</span>
//               </div>
//               <div className="grid grid-cols-3 gap-3">
//                 {themes.map((theme) => (
//                   <button
//                     key={theme.id}
//                     onClick={() => setSelectedTheme(theme.id)}
//                     className={`rounded-lg border p-4 text-center ${
//                       selectedTheme === theme.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:border-gray-400"
//                     }`}
//                   >
//                     <div className="mb-1 text-2xl">{theme.icon}</div>
//                     <div className="text-xs font-medium">{theme.name}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Image Upload */}
//             <div>
//               <p className="mb-3 text-sm text-gray-600">
//                 Add a special image, character, or logo to personalize the T-shirt even more.
//               </p>
//               <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   id="image-upload"
//                 />
//                 <label htmlFor="image-upload" className="cursor-pointer">
//                   {uploadedImage ? (
//                     <img
//                       src={uploadedImage || "/placeholder.svg"}
//                       alt="Uploaded"
//                       className="mx-auto h-32 max-w-full object-contain"
//                     />
//                   ) : (
//                     <>
//                       <div className="mb-2 text-gray-400">📷</div>
//                       <div className="text-sm text-gray-500">+ Select an Image</div>
//                     </>
//                   )}
//                 </label>
//               </div>
//             </div>

//             {/* Optional Message */}
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">📝 Optional Message</label>
//               <textarea
//                 value={optionalMessage}
//                 onChange={(e) => setOptionalMessage(e.target.value)}
//                 placeholder="e.g. It's My Party Time SOFIA"
//                 rows={3}
//                 className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm"
//               />
//             </div>

//             {/* Generate Button */}
//             <div className="pt-6">
//               <button
//                 onClick={handleGenerate}
//                 disabled={isLoading}
//                 className="w-full rounded-lg bg-[#223B7D] px-6 py-3 font-medium hover:cursor-pointer text-white shadow-md hover:bg-[#1a2d61] disabled:opacity-50"
//               >
//                 {isLoading ? "Generating..." : "✨ Generate T-Shirt"}
//               </button>
//             </div>
//           </div>

//           {/* Right Column - Preview */}
//           <TShirtPreviewNew
//             tShirtDesign={tShirtDesign || tShirtPlaceholder}
//             tShirtMockup={tShirtMockup || tShirtPlaceholder}
//             colors={colors}
//             selectedColor={selectedColor}
//             uploadedImage={uploadedImage}
//             selectedTheme={themes}
//             selectedThemeId={selectedTheme}
//             childName={childName}
//             age={age}
//             optionalMessage={optionalMessage}
//             quantity={quantity}
//             setQuantity={setQuantity}
//             tshirtType = {tshirtType}
//             size = {size}
//             gender = {gender}
//             theme = {selectedTheme}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomTShirt;

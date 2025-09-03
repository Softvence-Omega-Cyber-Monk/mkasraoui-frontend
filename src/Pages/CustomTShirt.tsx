import React, { useState } from "react";
import tShirt from "@/assets/t-shirt/white-t-shirt-mockup.png";
import TShirtPreviewNew from "@/components/Customize-t-shirt/TShirtPreviewNew";
import MyHeader from "@/components/MyHeader/MyHeader";

function CustomTShirt() {
  const [tshirtType, setTshirtType] = useState("child");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [selectedColor, setSelectedColor] = useState("white");
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("unicorns");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [optionalMessage, setOptionalMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);

  const colors = [
    { name: "white", bg: "bg-white", border: "border-gray-300" },
    { name: "pink", bg: "bg-pink-300", border: "border-pink-300" },
    { name: "teal", bg: "bg-teal-300", border: "border-teal-300" },
    { name: "yellow", bg: "bg-yellow-300", border: "border-yellow-300" },
    { name: "black", bg: "bg-black", border: "border-black" },
    { name: "lightblue", bg: "bg-blue-200", border: "border-blue-200" },
  ];

  const themes = [
    { id: "unicorns", name: "Unicorns", icon: "🦄" },
    { id: "pirates", name: "Pirates", icon: "🏴‍☠️" },
    { id: "princess", name: "Princess", icon: "👑" },
    { id: "superheroes", name: "Superheroes", icon: "🦸" },
    { id: "jungle", name: "Jungle", icon: "🌿" },
    { id: "space", name: "Space", icon: "🚀" },
  ];

  const sizes = [
    "2-3 years",
    "4-5 years",
    "6-7 years",
    "8-9 years",
    "10-11 years",
    "12-13 years",
  ];
  const genders = ["Boy", "Girl", "Unisex"];
  const ages = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ];

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

  return (
    <div>
      <MyHeader
        title="Custom T-Shirt Designer"
        subtitle="Create unique, personalized t-shirts for your child's special day. Choose from our collection of themes and make it truly memorable!"
        className="text-3xl sm:text-5xl md:text-6xl"
      ></MyHeader>
      <div className="container mx-auto -mt-20 bg-white p-6">
        <h1 className="mb-14 text-center text-2xl font-bold text-gray-800">
          Create Your Personalized Birthday T-Shirt
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Customization Options */}
          <div className="space-y-6">
            {/* T-Shirt Type */}
            <div>
              <div className="mb-3 flex items-center">
                <span className="mr-2 text-sm text-gray-600">👕</span>
                <span className="text-sm font-medium text-gray-700">
                  T-Shirt Type
                </span>
              </div>
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setTshirtType("child")}
                  className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    tshirtType === "child"
                      ? "bg-[#223B7D] text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Child
                </button>
                <button
                  onClick={() => setTshirtType("adult")}
                  className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    tshirtType === "adult"
                      ? "bg-[#223B7D] text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Adult
                </button>
              </div>
            </div>

            {/* Size and Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 flex items-center">
                  <span className="mr-2 text-sm text-gray-600">📏</span>
                  <span className="text-sm font-medium text-gray-700">
                    Size
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                  >
                    {size || "Select a size"}
                    <span className="float-right">▼</span>
                  </button>
                  {showSizeDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
                      {sizes.map((sizeOption) => (
                        <button
                          key={sizeOption}
                          onClick={() => {
                            setSize(sizeOption);
                            setShowSizeDropdown(false);
                          }}
                          className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center">
                  <span className="mr-2 text-sm text-gray-600">👤</span>
                  <span className="text-sm font-medium text-gray-700">
                    Gender
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                  >
                    {gender || "Select"}
                    <span className="float-right">▼</span>
                  </button>
                  {showGenderDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
                      {genders.map((genderOption) => (
                        <button
                          key={genderOption}
                          onClick={() => {
                            setGender(genderOption);
                            setShowGenderDropdown(false);
                          }}
                          className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50"
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
                <span className="text-sm font-medium text-gray-700">
                  Colors
                </span>
              </div>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-8 w-8 rounded-full border-2 ${color.bg} ${
                      selectedColor === color.name
                        ? "ring-2 ring-[#223B7D] ring-offset-2"
                        : color.border
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Child's Name and Age */}
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
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowAgeDropdown(!showAgeDropdown)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-left text-sm text-gray-600 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
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
                          className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50"
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
                    className={`rounded-lg border p-4 text-center transition-colors ${
                      selectedTheme === theme.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
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
                Add a special image, character, or logo to personalize the
                T-shirt even more.
              </p>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
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
                      <div className="mb-2 text-gray-400">📷</div>
                      <div className="text-sm text-gray-500">
                        + Select an Image
                      </div>
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
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <TShirtPreviewNew
            tShirt={tShirt}
            colors={colors}
            selectedColor={selectedColor}
            uploadedImage={uploadedImage}
            selectedTheme={themes}
            selectedThemeId={selectedTheme}
            childName={childName}
            age={age}
            optionalMessage={optionalMessage}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomTShirt;

// import bannerImg from "@/assets/party-banner-bg.png";
// import allBgImg from "@/assets/party-al-bg.png";
import { ArrowUpRight, ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import userCicler from "@/assets/profile-circle.png";
import { Link } from "react-router-dom";
import NeverMissPartyTip from "@/components/Never miss party tip/NeverMissPartyTip";
import MyHeader from "@/components/MyHeader/MyHeader";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [theme, setTheme] = useState("");

  // Simulate a search or filter action whenever parameters change
  useEffect(() => {
    console.log("Current Search Parameters:", {
      searchTerm,
      ageRange,
      theme,
    });
    // In a real application, you would trigger data fetching here
    //  fetching Data({ searchTerm, ageRange, theme });
  }, [searchTerm, ageRange, theme]);

  const blog = [
    {
      id: 1,
      title: "10 Amazing Superhero Party Ideas That Will Save the Day",
      description:
        "Transform your child's birthday into an epic superhero adventure with these creative ideas, from DIY costumes to action-packed games.",
      image: blog1,
      author: "Sarah Johnson",
      readTime: "8 min read",
      tags: ["DIY", "Decorations", "Games"],
      category: "Superhero",
    },
    {
      id: 2,
      title: "Princess Party Planning: Creating a Magical Kingdom",
      description:
        "Everything you need to know about hosting the perfect princess party, from royal decorations to enchanting activities.",
      image: blog2,
      author: "Emma Wilson",
      readTime: "6 min read",
      tags: ["Decorations", "Crafts", "Planning"],
      category: "Princess",
    },
    {
      id: 3,
      title: "Dinosaur Party Ideas: Prehistoric Fun for Modern Kids",
      description:
        "Dig into these fantastic dinosaur party ideas that will make your celebration roar with excitement and prehistoric fun.",
      image: blog3,
      author: "Sarah Johnson",
      readTime: "8 min read",
      tags: ["DIY", "Decorations", "Games"],
      category: "Dinosaur",
    },
    {
      id: 4,
      title: "Space Party Ideas: Blast Off to Birthday Fun",
      description:
        "Transform your child's birthday into an epic superhero adventure with these creative ideas, from DIY costumes to action-packed games.",
      image: blog4,
      author: "Sarah Johnson",
      readTime: "8 min read",
      tags: ["DIY", "Decorations", "Games"],
      category: "Space",
    },
    {
      id: 5,
      title: "Budget-Friendly Party Planning: Amazing Parties Under $100",
      description:
        "Everything you need to know about hosting the perfect princess party, from royal decorations to enchanting activities.",
      image: blog5,
      author: "Emma Wilson",
      readTime: "6 min read",
      tags: ["Decorations", "Crafts", "Planning"],
      category: "Budget",
    },
    {
      id: 6,
      title: "Unicorn Party Magic: Creating Rainbow Dreams",
      description:
        "Dig into these fantastic dinosaur party ideas that will make your celebration roar with excitement and prehistoric fun.",
      image: blog6,
      author: "Sarah Johnson",
      readTime: "8 min read",
      tags: ["DIY", "Decorations", "Games"],
      category: "Unicorn",
    },
  ];

  useEffect(()=>{

  },[])


  return (
    <div className="mx-auto w-full px-4 md:px-0">
      {/* ------header section start --------  */}
      <MyHeader
        title="Party Planning Blog"
        subtitle="Explore expert advice, creative DIYs, and smart parenting hacks to make every birthday unforgettable."
        className="text-3xl sm:text-5xl md:text-6xl"
      ></MyHeader>
      {/* ------header section end --------  */}
      <div className="container mx-auto">
        {/* search and filter part  */}
        <div className="mt-2">
          <div className="container mx-auto flex flex-col items-center space-y-4 rounded-xl bg-white p-4 py-8 shadow-md sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative w-full flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search themes, activities, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
                aria-label="Search themes, activities, or keywords"
              />
            </div>

            <div className="relative w-full sm:w-[140px]">
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
                aria-label="Select age range"
              >
                <option value="" disabled hidden>
                  Age Range
                </option>
                <option value="all">All Ages</option>
                <option value="0-5">0-5</option>
                <option value="6-12">6-12</option>
                <option value="13-18">13-18</option>
                <option value="18+">18+</option>
              </select>
              {/* Use ChevronDown icon for select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            <div className="relative w-full sm:w-[120px]">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
                aria-label="Select theme"
              >
                <option value="" disabled hidden>
                  Theme
                </option>
                <option value="all">All Themes</option>
                <option value="adventure">Adventure</option>
                <option value="education">Education</option>
                <option value="creative">Creative</option>
                <option value="sports">Sports</option>
              </select>
              {/* Use ChevronDown icon for select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        {/* blog card section start here  */}
        <div>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blog.map((item) => (
              <div
                key={item?.id}
                // 🔧 Make the whole card a flex column so button can stay at the bottom
                className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md transition-shadow hover:shadow-lg"
              >
                {/* Image Header */}
                <div className="relative h-56 w-auto">
                  <img
                    src={item?.image || "/placeholder.svg"}
                    alt={item?.title}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 rounded-full bg-[#223B7D] px-2.5 py-1.5 text-xs font-medium text-white`}
                  >
                    {item?.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <h3 className="mb-2 line-clamp-2 text-lg font-medium">
                    {item?.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
                    {item?.description}
                  </p>

                  {/* Author Info */}
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={userCicler}
                        alt=""
                        className="h-5 w-5 rounded-full"
                      />
                      <span className="text-sm font-medium text-[#5A5C5F]">
                        {item?.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm">{item?.readTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {item?.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#DFE1E6] bg-[#FFFFFF] px-2.5 py-1.5 text-xs text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Button - 🔧 mt-auto ensures it sticks to the bottom */}
                <div className="mt-auto p-4 pt-0">
                  <Link to={`/home/blog/${item?.id}`}>
                    <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white transition-colors hover:bg-[#343f5c]">
                      Read item?
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* blog card section end here  */}
      {/* never miss party trip start here  */}
      <div>
        <NeverMissPartyTip />
      </div>
      {/* never miss party trip end here  */}
    </div>
  );
}

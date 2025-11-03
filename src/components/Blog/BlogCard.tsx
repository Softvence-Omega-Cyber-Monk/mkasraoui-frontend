import { useGetBlogsQuery } from "@/redux/features/blog/blogApi";
import type { Blog } from "@/redux/types/blog.type";
import { ArrowUpRight, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import userCicler from "@/assets/profile-circle.png";

export default function BlogCard() {
  const { data, isLoading, isFetching } = useGetBlogsQuery();
  const blogs: Blog[] = data?.data ?? [];
  // const { userdata } = useGetMeQuery();
  // const users: User[] = userdata?.userdata ?? [];

  // console.log(users)
  // Extract unique badges & categories
  const allBadges = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.badge).filter(Boolean))),
    [blogs],
  );
  const allCategories = useMemo(
    () => Array.from(new Set(blogs.flatMap((b) => b.tag ?? []))),
    [blogs],
  );

  // Filters & search state
  const [selectedBadge, setSelectedBadge] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const blogsPerPage = 9;

  // Filtering logic
  const filteredBlogs = useMemo(() => {
    return blogs.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBadge =
        selectedBadge === "all" || item.badge === selectedBadge;

      const matchesCategory =
        selectedCategory === "all" || item.tag?.includes(selectedCategory);

      return matchesSearch && matchesBadge && matchesCategory;
    });
  }, [blogs, searchTerm, selectedBadge, selectedCategory]);

  // Pagination calculations
  const total = filteredBlogs.length;
  const totalPages = Math.ceil(total / blogsPerPage);
  const startIndex = (page - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  if (isLoading || isFetching) {
    return <p className="py-10 text-center">Loading blogs...</p>;
  }

  return (
    <div className="mx-auto w-full px-4 md:px-0">
      {/* Search & Filters */}
      <div className="container mx-auto mt-6 flex flex-col items-center gap-4 rounded-xl bg-white p-4 shadow-md sm:flex-row sm:items-start sm:gap-4">
        {/* Search Input */}
        <div className="relative w-full flex-1">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          />
        </div>

        {/* Badge Filter */}
        <div className="relative w-full sm:w-[140px]">
          <select
            value={selectedBadge}
            onChange={(e) => {
              setSelectedBadge(e.target.value);
              setPage(1);
            }}
            className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          >
            <option value="all">All Badges</option>
            {allBadges.map((badge) => (
              <option key={badge} value={badge}>
                {badge}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative w-full sm:w-[140px]">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Cards */}
      <div>
        <div className="container mx-auto mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedBlogs.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-lg bg-[#FFF7ED] shadow-md hover:shadow-lg"
            >
              <div className="relative h-56 w-full">
                <img
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                {item.badge && (
                  <span className="absolute top-3 right-3 rounded-full bg-[#223B7D] px-2.5 py-1.5 text-xs font-medium text-white">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="flex-1 p-4">
                <h3 className="mb-2 line-clamp-2 text-lg font-medium">
                  {item.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-sm text-[#5A5C5F]">
                  {item.description}
                </p>

                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* <img src={userusers.Cicler} alt="author" className="h-5 w-5 rounded-full" />
                  <span className="text-sm font-medium text-[#5A5C5F]">{userCicler.rol}</span> */}
                    <img
                      src={userCicler}
                      alt="author"
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-[#5A5C5F]">
                      {" "}
                      admin
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {item.tag?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#DFE1E6] bg-[#FFFFFF] px-2.5 py-1.5 text-xs text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto p-4 pt-0">
                <Link to={`/home/blog/${item.id}`}>
                  <button className="hover:bg-secondary-light flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#223B7D] px-4 py-3 text-sm text-white hover:cursor-pointer">
                    Read Blog
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="container mx-auto">
          {blogs.length > 0 && (
            <div className="mt-6 flex items-center justify-between px-4 py-3">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">{paginatedBlogs.length}</span> of{" "}
                <span className="font-medium">{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
                  {page} / {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination UI */}
    </div>
  );
}

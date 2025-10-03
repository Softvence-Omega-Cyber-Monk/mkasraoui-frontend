 




// src/pages/BlogDetails.tsx
import { useParams } from "react-router-dom";
import { useGetBlogsQuery } from "@/redux/features/blog/blogApi";
import NeverMissPartyTip from "@/components/Never miss party tip/NeverMissPartyTip";
 
interface Blog {
  id: string | number;
  title: string;
  description: string;
  images?: string[];
  content?: string;
  conclusion?: string;
  tag?: string[];
}

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetBlogsQuery();

  if (isLoading) return <p className="py-10 text-center">Loading...</p>;
  if (isError) return <p className="py-10 text-center text-red-500">Error loading blog</p>;

  const blog: Blog | undefined = data?.data.find(
    (b: Blog) => b.id === id || b.id === Number(id)
  );

  if (!blog) return <p className="py-10 text-center text-red-500">Blog not found</p>;

  return (
    <div>
      {/* Banner */}
     <div
  className="relative w-11/12 mx-auto h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center rounded-xl overflow-hidden"
  style={{ backgroundImage: `url(${blog.images?.[0]})` }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Title */}
  <div className="relative z-10 h-full flex items-center justify-center">
    <h1 className="text-center text-2xl md:text-4xl lg:text-5xl font-bold text-white px-4 leading-snug">
      {blog.title}
    </h1>
  </div>
</div>

      {/* Main Content */}
      <div className="mt-20 max-w-4xl mx-auto px-6 py-6">
        <article className="prose prose-lg max-w-none">
          <header className="mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Introduction</h1>
          </header>

          <div className="space-y-8">
            <p className="text-gray-700 leading-relaxed">{blog.description}</p>

            {/* First Image */}
            {blog.images && blog.images.length > 0 && (
              <div className="my-12">
                <div className="relative h-96 w-auto">
                  <img
                    src={blog.images[0]}
                    alt={blog.title}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3 italic text-left">
                  Image caption goes here
                </p>
              </div>
            )}

            {/* Additional Content */}
            {blog.content && (
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}

            {/* Conclusion */}
            {blog.conclusion && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-3">
                  Conclusion
                </h2>
                <div
                  className="p-4      min-h-[200px] [&_img]:w-full [&_img]:h-auto"
                  dangerouslySetInnerHTML={{ __html: blog.conclusion }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tag && blog.tag.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.tag.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>

      {/* Never Miss Party Tip */}
      <NeverMissPartyTip />
    </div>
  );
}













 


























 
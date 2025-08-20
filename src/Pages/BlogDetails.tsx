import { useParams } from "react-router-dom";
import bannerImg from "@/assets/new-blog-detailes.png";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";
import NeverMissPartyTip from "@/components/Never miss party tip/NeverMissPartyTip";
// import userCicler from "@/assets/profile-circle.png";



export default function BlogDetails() {
  const { id } = useParams(); // id is a string
  console.log("Article ID:", id);

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

const findBlog = blog.find((item) => item.id === Number(id));
console.log(findBlog);

  return (
    <div>
      <div className="relative w-full  mx-auto bg-cover bg-center"
      style={{
        backgroundImage: `url(${bannerImg})`
      }}
      >
        
          
        {/* Black Overlay */}
        <div className="bg-opacity-50 absolute inset-0 bg-black/50"></div>

        {/* Text Content */}
        <div className="relative z-10 py-56 flex items-center justify-center">
          <h1 className="text-center text-2xl font-bold text-white md:text-4xl px-4">
            {findBlog?.title}
          </h1>
        </div>
      </div>
      {/* intro text start here  */}
      <div className=" mt-20">
      
        <div className="max-w-4xl mx-auto px-6 py-6">
        <article className="prose prose-lg max-w-none">
          {/* Header */}
          <header className="mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-8  ">
              Introduction
            </h1>
          </header>

          {/* Main Content */}
          <div className="space-y-8">
            <p className="text-gray-700 leading-relaxed">
              In consequat elit vel tempor lacus ut lorem ipsum. Vestibulum suscipit nulla bibendum facilisis aliquam 
              ipsum. Mauris blandit luctus mauris, et ut. Nulla aliquet lorem velit, nam. Mauris potenti vulputate erat 
              amet lorem in velit. Vestibulum ut mauris mauris a mauris. Dolor elit erat mauris turpis, at pellentesque et amet eu nec.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Cursus quis turpis tristique pulvinar. Aliquam ac. Eget in vulputate rhodo ac vulputate lorem vitae sed molestie 
              vulputate. Vulputate sed lorem ipsum convallis, dolor eu mauris donec ac. Suscipit bibendum nunc, at lorem. In 
              mauris velit et suspendisse, ipsum molestie aliquam donec aliquet ut vel vulputate.
            </p>

            {/* Image Section */}
            <div className="my-12">
              <div className="relative h-96 w-auto ">
                <img 
                  src={findBlog?.image}
                  alt="Children celebrating with party decorations" 
                  className="w-full h-full  object-cover rounded-lg shadow-md"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 italic text-left">
                Image caption goes here
              </p>
            </div>

            <p className="text-black font-bold leading-relaxed">
              Dolor amet eu lorem ante sed felis nulla. Aliquam vestibulum, nulla odio elit nitor. In 
              aliquot pellentesque annean nunc vestibulum tempus in ut bibendum diam. Rhoncus 
              integer aliquam ut vitae molestudae tristique. felis nulla. Aliquam vestibulum.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Lorem ipsum dolor sed nulla facilisis ut eius velit congue mollis semper convallis convallis mau. Sed 
              felis ut ipsum a volutpat phasellus ut leo velit. Donec leo, urna tempor ut posuere 
              lorem blandit vestibus neque porta ut congue sceleris volutpat. Aliquot magna et feugiat cursus gravida 
              lorem. Sed aliquam dolor sed magna mauris. Bibendum in tae. Sed eget mauris 
              lorem sed aliquam mauris ut neque, mauris amet quam velit sem, tempus velit eget lorem ut.
            </p>

            {/* Quote Section */}
            <blockquote className="border-l-4 borderblack  italic pl-6 py-4 my-8 text-[#000000] bg-blue-50 rounded-r-lg">
              <p className="text-gray-800 italic leading-relaxed">
                "Aliquam elit mauris rhctu vitiem quam nulla. Gravidas ut gravidas ac arco mauris mollis id. Nam 
                pellentesque congue eget consectetur tempor. Sapien, viverra mauris amet mauris mollis 
                aliquam. Rhon velit vitae, ullamcoper pellaque tempor."
              </p>
            </blockquote>

            <p className="text-gray-700 leading-relaxed">
              Tempus nulla demenat velit potenti cursus leo metus, viverra. Blandit dui ultrices vulputate mauris 
              eugas nec alique et. Aliquam feugaceper quam. A cursus, nascent lectum sagittis dolor et mauris mauris. 
              Consectetur nulla justo quis vitae posuere turpis. Aliquam vitae ut amet sagittis interdum dolor eu turpis 
              vestibulum.
            </p>

            {/* Conclusion Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-3">
                Conclusion
              </h2>

              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Mauris gravida mauris augure tellus gravida et tellentibus elit ut taciturn. Ullam id molestique est ulttam libero. Amet et 
                  congue urna lorem ut eget gravida. Suscipit imperia consequent justo velit, etiam ut vestibulum ante metus 
                  porta bibendum.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Mauris ut lacinia blanquet tellentibus ut eius alique nulla phasellus amet gravida sed magna. Ut tristique 
                  bibendum convallis velit eget lacinia mauris. Eget sapien ut lorem velit ut. Quam blandit id ut vel congue 
                  velit mauris tempetus cursus.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Lorem ipsum dolor et lorem ut velit mauris lorem alique. Nam ulla mauris turpis vel posuere velit 
                  diam lorem. Cursus et mauris eget quam. Aliquam auiseuele mauris et ut eget consectetur aliquir. Donec 
                  dolor amet sed cursus elit consequat amet et eu dui verum tellus alique eu quis. Mauris et blandit 
                  pellentesque elit lacinia turpis lorem tempor.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
      </div>
      {/* intro text end here  */}
      {/* never miss trip start here  */}
      <div className="">
        
        <NeverMissPartyTip/>
      </div>
      {/* never miss trip end here */}
    </div>
  );
}

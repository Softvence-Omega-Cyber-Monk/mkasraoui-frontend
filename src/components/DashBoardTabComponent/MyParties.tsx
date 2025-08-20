
import p1 from "@/assets/my-perti-p1.png"
import p2 from "@/assets/my-perti-p2.png"
import p3 from "@/assets/my-perti-p3.png"
import p4 from "@/assets/my-perti-p4.png"
import p5 from "@/assets/my-perti-p5.png"
import p6 from "@/assets/my-perti-p6.jpg"
import { Download, Share2, SquarePen } from "lucide-react"


function MyParties() {
  const events = [
    {
      imageUrl: p1,
      imageAlt: "Kids at a birthday party with a cake",
      title: "Emma's 7th Birthday",
      subtitle: "Superhero Adventure",
      date: "2/15/2024",
      guests: 12,
    },
    {
      imageUrl: p2,
      imageAlt: "Boy smiling at a birthday party with friends",
      title: "Emma's 7th Birthday",
      subtitle: "Superhero Adventure",
      date: "2/15/2024",
      guests: 12,
    },
    {
       imageUrl: p3,
      imageAlt: "Girl blowing out birthday candles",
      title: "Emma's 7th Birthday",
      subtitle: "Superhero Adventure",
      date: "2/15/2024",
      guests: 12,
    },
    {
       imageUrl: p4,
      imageAlt: "Single birthday cake on a table",
      title: "Emma's 7th Birthday",
      subtitle: "Superhero Adventure",
      date: "2/15/2024",
      guests: 12,
    },
    {
       imageUrl: p5,
      imageAlt: "Colorful birthday cake with cartoon characters",
      title: "Emma's 7th Birthday",
      subtitle: "Superhero Adventure",
      date: "2/15/2024",
      guests: 12,
    },
    {
       imageUrl: p6,
      imageAlt: "Kids clapping at a birthday party",
      title: "Emma's 7th Birthday",
      subtitle: "Superhero Adventure",
      date: "2/15/2024",
      guests: 12,
    },
    {
       imageUrl: p6,
      imageAlt: "Kids clapping at a birthday party",
      title: "Emma's 7th Birthday",
      subtitle: "Superhero Adventure",
      date: "2/15/2024",
      guests: 12,
    },
    {
       imageUrl: p6,
      imageAlt: "Kids clapping at a birthday party",
      title: "Emma's 7th Birthday",
      subtitle: "Superhero Adventure",
      date: "2/15/2024",
      guests: 12,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
    
      <div className=" px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <div key={index} className="w-full max-w-sm mx-auto rounded-xl overflow-hidden  bg-[#FFF7ED]">
            {/* Card Header (Image and Planned Badge) */}
            <div className="relative">
              <img
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.imageAlt}
                width={400}
                height={225}
                className="w-full h-auto object-cover aspect-[16/9]"
              />
              <div className="absolute top-3 right-3 bg-[#FFFFFF] backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-full ">
                Planned
              </div>
            </div>

            {/* Card Content (Details) */}
            <div className="p-6 grid gap-2">
              <h3 className="text-lg font-semibold text-[#441306]">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.subtitle}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <strong>{event.date}</strong>
               
                <strong>{event.guests} GUEST</strong>
              </div>
            </div>

            {/* Card Footer (Buttons) */}
            <div className="p-6 pt-0 flex justify-between gap-2">
              <button className="flex-1 flex  cursor-pointer items-center justify-center bg-[#223B7D] px-4 py-2 rounded-md text-white bg-v0-dark-blue hover:bg-v0-dark-blue/90 focus:outline-none focus:ring-2 focus:ring-v0-dark-blue focus:ring-offset-2">
               <SquarePen className="mr-2 h-5" /> Edit
              </button>
              <button className="w-10 h-10 flex cursor-pointer  items-center justify-center border border-v0-dark-blue text-v0-dark-blue rounded-md hover:bg-[#E6DED4]   ">
               <Download className="h-5 font-normal"/>
              </button>
              <button className="w-10 h-10 flex cursor-pointer  items-center justify-center border border-v0-dark-blue text-v0-dark-blue rounded-md hover:bg-[#E6DED4] ">
              <Share2 className="h-5 font-normal"/>
              </button>
            </div>
          </div>
        ))}
      </div>
   
    </div>
  )
}

export default MyParties
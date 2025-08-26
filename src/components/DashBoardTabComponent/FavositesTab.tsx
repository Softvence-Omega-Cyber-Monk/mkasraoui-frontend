import p1 from "@/assets/favosites-p1.jpg";
import p2 from "@/assets/favosites-p2.png";
import p3 from "@/assets/favosites-p3.png";

function FavositesTab() {
  const boxes = [
    {
      id: 1,
      imageSrc: p1,
      imageAlt: "Smiling child at a birthday party",
      title: "Superhero Adventure Box",
      category: "Superhero",
      price: "$49.99",
    },
    {
      id: 2,
      imageSrc: p2,
      imageAlt: "Girl dressed as a princess at a birthday party",
      title: "Princess Magical Kingdom",
      category: "Superhero",
      price: "$49.99",
    },
    {
      id: 3,
      imageSrc: p3,
      imageAlt: "Birthday party by a swimming pool",
      title: "Space Explorer Mission",
      category: "Superhero",
      price: "$49.99",
    },
    {
      id: 4,
      imageSrc: p3,
      imageAlt: "Birthday party by a swimming pool",
      title: "Space Explorer Mission",
      category: "Superhero",
      price: "$49.99",
    },
  ];
  return (
    <div>
      <div className="container mx-auto rounded-2xl border border-[#E6E6E6] bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold">Favourite Boxes</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boxes.map((box) => (
            <div
              key={box.id}
              className="flex h-full flex-col overflow-hidden rounded-xl bg-[#FFF7ED]"
            >
              <div className="relative h-52 w-full">
                <img
                  src={box.imageSrc || "/placeholder.svg"}
                  alt={box.imageAlt}
                  className="h-full w-full rounded-t-xl object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#191919]">
                  {box.title}
                </h3>
                <p className="text-sm text-gray-500">{box.category}</p>
                <p className="mt-2 text-lg font-bold text-[#223B7D]">
                  {box.price}
                </p>
              </div>
              <div className="mt-auto p-6 pt-0">
                <button className="bg-secondary hover:bg-secondary-dark inline-flex w-full cursor-pointer items-center justify-center rounded-md py-2 text-base font-medium whitespace-nowrap text-white hover:bg-gray-50">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FavositesTab;

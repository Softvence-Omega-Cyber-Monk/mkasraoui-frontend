export default function CombinationPacks() {
  const packs = [
    {
      title: "Box + T-shirt",
      description: "1 DIY box + 1 custom T-shirt",
      nonSubscriberPrice: "€42.90",
      premiumPrice: "€33.90",
    },
    {
      title: "Express Party",
      description: "AI Generator + Checklist + Digital Invite",
      nonSubscriberPrice: "€7.90",
      premiumPrice: "Included",
    },
    {
      title: "Gift Pack",
      description: "5 Gift Ideas + Links + Wishlist",
      nonSubscriberPrice: "€3.90",
      premiumPrice: "Included",
    },
    {
      title: "Organization Pack",
      description: "Planner + Tutorials + Checklist + Templates",
      nonSubscriberPrice: "€9.90",
      premiumPrice: "Included",
    },
  ];

  return (
    <div className="bg-[#BBDEFB] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <h1 className="mb-12 text-center text-4xl font-bold text-blue-900">
          Combination Packs
        </h1>

        {/* Packs Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {packs.map((pack, index) => (
            <div key={index} className="rounded-lg bg-white p-8 shadow-sm">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                {pack.title}
              </h2>
              <p className="text-body mb-6">{pack.description}</p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-body">Non-Subscriber: </span>
                  <span className="text-body">{pack.nonSubscriberPrice}</span>
                </div>
                <div>
                  <span className="text-secondary font-medium">Premium: </span>
                  <span className="text-secondary font-semibold">
                    {pack.premiumPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

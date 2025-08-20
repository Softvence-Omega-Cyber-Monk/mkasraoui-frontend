import { FaGift, FaStar, FaUserFriends } from "react-icons/fa";

export default function LoyaltyReferralBonuses() {
  const bonuses = [
    {
      icon: FaUserFriends,
      title: "1 Month Free",
      description: "For Referring 3 Friends",
    },
    {
      icon: FaGift,
      title: "Loyalty Reward",
      description: "1 Free Digital Product on Your Anniversary",
    },
    {
      icon: FaStar,
      title: "Special Offers",
      description: "Exclusive Discounts for Premium Members",
    },
  ];

  return (
    <div className="mx-auto my-12 max-w-6xl p-6">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-secondary text-4xl font-bold">
          Loyalty & Referral Bonuses
        </h1>
      </div>

      {/* Bonuses Grid */}
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {bonuses.map((bonus, index) => (
          <div key={index} className="text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <bonus.icon
                className="h-16 w-16 text-gray-800"
                strokeWidth={1.5}
              />
            </div>

            {/* Title */}
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {bonus.title}
            </h2>

            {/* Description */}
            <p className="leading-relaxed text-gray-600">{bonus.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Calendar, Crown, Heart, Sparkles, Users, Zap } from "lucide-react";

const FeaturesGrid = () => {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-gray-700" />,
      title: "Unlimited AI Magic",
      description:
        "Create as many personalized party plans as you want with our advanced AI",
    },
    {
      icon: <Crown className="h-8 w-8 text-gray-700" />,
      title: "Premium Templates",
      description:
        "Access to exclusive, professionally designed invitation and decoration templates",
    },
    {
      icon: <Calendar className="h-8 w-8 text-gray-700" />,
      title: "Smart Reminders",
      description:
        "Never miss a deadline with intelligent notifications and timeline management",
    },
    {
      icon: <Users className="h-8 w-8 text-gray-700" />,
      title: "Guest Management",
      description:
        "Create as many personalized party plans as you want with our advanced AI",
    },
    {
      icon: <Zap className="h-8 w-8 text-gray-700" />,
      title: "Priority Support",
      description:
        "Access to exclusive, professionally designed invitation and decoration templates",
    },
    {
      icon: <Heart className="h-8 w-8 text-gray-700" />,
      title: "Custom Branding",
      description:
        "Never miss a deadline with intelligent notifications and timeline management",
    },
  ];

  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-6 text-center"
        >
          <div className="mb-4 flex justify-center">{feature.icon}</div>
          <h3 className="mb-3 text-xl font-semibold text-gray-900">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeaturesGrid;

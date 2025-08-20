import { Check } from "lucide-react";

export default function ServiceProvidersArea() {
  const freeFeatures = ["Catalog Listing", "Basic Profile", "Standard Support"];

  const proFeatures = [
    "All Free Features",
    "Geolocated Visibility",
    "Quick Quote Feature",
    "Reviews + Quality Badge",
    "Priority Support",
  ];

  return (
    <div className="mx-auto w-full bg-[#F9FAFB] px-4 py-18">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-blue-900">
            Service Providers Area
          </h1>
        </div>

        {/* Provider Cards */}
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Free Provider */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Free Provider
            </h2>

            <div className="space-y-4">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Provider */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Pro Provider
            </h2>
            <p className="mb-6 text-gray-600">€7.90/month or €79/year</p>

            <div className="space-y-4">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

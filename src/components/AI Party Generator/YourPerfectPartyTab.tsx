import { Link } from "react-router-dom";
import { useState } from "react";
import { useCreatePartyPlanMutation } from "@/redux/features/partyPlan/partyPlanApi";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  description: string;
  product_type: string;
  age_range: string;
  price: number;
  discounted_price: number | null;
  included: string[];
  tutorial: string | null;
  imges: string[];
  avg_rating: number;
  total_review: number;
  theme: string;
}

interface PartyPlan {
  [key: string]: string[];
}

interface PartyPlanResponse {
  party_plan: PartyPlan;
  suggest_gifts: {
    product_ids: string[];
  };
  all_product: {
    diyBoxes: Product[];
    gifts: Product[];
  };
}

interface YourPerfectPartyTabProps {
  setActiveStep: (step: string) => void;
  partyPlanData?: PartyPlanResponse;
  preferencesData?: {
    person_name?: string;
    person_age?: number;
    budget?: number;
    num_guests?: number;
    party_type?: string;
    theme?: string;
    location?: string;
    dietary_restrictions?: string[];
    party_date?: string;
    party_details?: string;
    favorite_activities?: string[];
  };
}

const YourPerfectPartyTab: React.FC<YourPerfectPartyTabProps> = ({
  setActiveStep,
  partyPlanData,
  preferencesData
}) => {
  const [createPartyPlan, { isLoading: isSaving }] = useCreatePartyPlanMutation();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!partyPlanData) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#223B7D] border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700">Loading your perfect party...</h2>
        </div>
      </div>
    );
  }

  const { party_plan, suggest_gifts, all_product } = partyPlanData;

  const getSuggestedProducts = (): Product[] => {
    const allProducts = [...all_product.diyBoxes, ...all_product.gifts];
    return suggest_gifts.product_ids
      .map(id => allProducts.find(product => product.id === id))
      .filter((product): product is Product => product !== undefined);
  };

  const suggestedProducts = getSuggestedProducts();

  const handleBackToPreferences = () => {
    setActiveStep("Preferences");
  };

  const handleSaveParty = async () => {
    try {
      const requestBody = {
        person_name: preferencesData?.person_name || "Guest",
        person_age: preferencesData?.person_age || 0,
        budget: preferencesData?.budget || 0,
        num_guests: preferencesData?.num_guests || 0,
        party_date: preferencesData?.party_date || new Date().toISOString(),
        location: preferencesData?.location || "",
        party_details: {
          theme: preferencesData?.theme || "",
          favorite_activities: preferencesData?.favorite_activities || []
        },
        num_product: suggestedProducts.length
      };

      const response = await createPartyPlan(requestBody).unwrap();

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
      toast.success("Party saved successfully");

      console.log("Party saved successfully:", response);
    } catch (error) {
      console.error("Failed to save party:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {saveStatus !== 'idle' && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${saveStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white font-semibold animate-fade-in`}>
          {saveStatus === 'success' ? '✅ Party saved successfully!' : '❌ Failed to save party'}
        </div>
      )}

      <div className="text-center mb-16 bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#223B7D] mb-4">
          🎉 Your Perfect Party Plan! ✨
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI has synthesized your preferences into an amazing, detailed plan. Let's get this party started!
        </p>
      </div>

      <div className="space-y-10 mb-16">
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-6">The Party Blueprint</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(party_plan).map(([sectionTitle, items], index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-2xl p-6 border-t-4 border-[#223B7D]"
            >
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center">
                <span className="mr-3 text-[#223B7D]">
                  {sectionTitle.toLowerCase().includes('theme') && '🎨'}
                  {sectionTitle.toLowerCase().includes('food') && '🍕'}
                  {sectionTitle.toLowerCase().includes('activities') && '🎈'}
                  {sectionTitle.toLowerCase().includes('decoration') && '💡'}
                  {!['theme', 'food', 'activities', 'decoration'].some(s => sectionTitle.toLowerCase().includes(s)) && '📋'}
                </span>
                {sectionTitle}
              </h3>
              <ul className="space-y-4">
                {items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start space-x-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border-l-4 border-gray-300"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-[#223B7D] rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">
                      {itemIndex + 1}
                    </div>
                    <p className="text-gray-700 flex-1 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-16 border-gray-200" />

      {suggestedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-8">
            🎁 Recommended Products
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {suggestedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-2xl hover:shadow-primary transition-all duration-300 transform hover:-translate-y-1"
              >
                {product.imges && product.imges.length > 0 && (
                  <div className="h-48 w-80">
                    <img
                      src={product.imges[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-extrabold text-xl text-gray-900 mb-2 truncate">
                    {product.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-3 h-[60px]">
                    {product.description}
                  </p>

                  {product.total_review > 0 && (
                    <div className="flex items-center mb-4">
                      {renderStars(Math.round(product.avg_rating))}
                      <span className="ml-2 text-sm text-gray-600 font-medium">
                        ({product.total_review})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.discounted_price ? (
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-red-600">
                            ${product.discounted_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-[#223B7D]">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Link to={`/home/diyboxe/details/${product.id}`}>
                      <button className="bg-[#223B7D] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#1a2f66] transition-colors shadow-md">
                        Details
                      </button>
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium">
                      {product.age_range}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-medium">
                      {product.product_type.replace('_', ' ')}
                    </span>
                  </div>

                  {product.included && product.included.length > 0 && (
                    <div className="mt-3 border-t pt-3">
                      <p className="text-xs text-gray-500 mb-2 font-semibold">What's Inside:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.included.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                        {product.included.length > 3 && (
                          <span className="text-xs text-gray-500 font-medium self-center">
                            +{product.included.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="my-16 border-gray-200" />

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <button
          onClick={handleBackToPreferences}
          className="px-8 py-3 border-2 border-[#223B7D] text-[#223B7D] rounded-xl font-semibold hover:bg-[#223B7D] hover:text-white transition-all shadow-md"
        >
          🔄 Generate New Plan
        </button>

        <button
          onClick={handleSaveParty}
          disabled={isSaving}
          className={`px-8 py-3 bg-[#223B7D] text-white rounded-xl font-semibold hover:bg-[#1a2f66] transition-colors shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            '💾 Save This Plan'
          )}
        </button>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl p-8 shadow-xl border-t-4 border-[#223B7D]">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Party Plan Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-extrabold text-[#223B7D]">
              {Object.keys(party_plan).length}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">Plan Sections</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-extrabold text-[#223B7D]">
              {Object.values(party_plan).reduce((acc, items) => acc + items.length, 0)}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">Total Items</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-extrabold text-[#223B7D]">
              {suggestedProducts.length}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">Recommended Products</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-extrabold text-[#223B7D]">
              ${suggestedProducts.reduce((sum, product) => sum + (product.discounted_price || product.price), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">Products Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourPerfectPartyTab;
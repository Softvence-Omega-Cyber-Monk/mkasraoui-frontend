import { useState } from "react";
import { useCreatePartyPlanMutation } from "@/redux/features/partyPlan/partyPlanApi";
import { useSavePartyPlanMutation } from "@/redux/features/partyGeneration/partyGenerationApi";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

interface PartyPlan {
  [key: string]: string[];
}

interface AdventureSongMovie {
  title: string;
  description: string;
  channel: string;
  url: string;
  views: string;
}

interface PartyProducts {
  id: string;
  title: string;
  link: string;
  image_url: string
}

interface PartyPlanResponse {
  party_plan: PartyPlan;
  adventure_song_movie_links?: AdventureSongMovie[];
  suggested_gifts?: {
    products: PartyProducts[];
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
  const [savePartyPlan] = useSavePartyPlanMutation()
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

  const { party_plan, adventure_song_movie_links, suggested_gifts } = partyPlanData;
  const amazonProducts = suggested_gifts?.products || [];


  // Check if party_plan exists and is valid
  if (!party_plan || typeof party_plan !== 'object') {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="text-center py-20">
          <div className="text-red-500 text-xl mb-4">⚠️ Invalid party plan data</div>
          <button
            onClick={() => setActiveStep("Preferences")}
            className="px-8 py-3 bg-[#223B7D] text-white rounded-xl font-semibold hover:bg-[#1a2f66] transition-colors shadow-lg"
          >
            Go Back to Preferences
          </button>
        </div>
      </div>
    );
  }

  const handleBackToPreferences = () => {
    setActiveStep("Preferences");
  };

  const handleSaveParty = async () => {
    try {
      // Transform party_plan into sections format
      const sections = Object.entries(party_plan).map(([sectionName, items], _index) => ({
        name: sectionName,
        items: items.map((item, itemIndex) => ({
          description: item,
          sortOrder: itemIndex
        }))
      }));

      // Extract timeline events if they exist in party_plan
      const timelineEvents = party_plan["Timeline"] || party_plan["Schedule"] || party_plan["Party Schedule"]
        ? (party_plan["Timeline"] || party_plan["Schedule"] || party_plan["Party Schedule"]).map((event, index) => {
          // Try to extract time from the event string (e.g., "3:00 PM - Guest arrival")
          const timeMatch = event.match(/(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)/);
          return {
            time: timeMatch ? timeMatch[0] : `Event ${index + 1}`,
            description: event,
            sortOrder: index
          };
        })
        : [];

      // Transform Amazon products into suggestedGifts format
      const suggestedGifts = amazonProducts.map(product => ({
        productId: product.id
      }));

      // Generate party title
      const partyTitle = `${preferencesData?.theme || 'Party'} for ${preferencesData?.person_name || 'Guest'}`;

      // Ensure scheduledDate is in ISO 8601 format
      let scheduledDate: string;
      if (preferencesData?.party_date) {
        // If party_date is already a valid date string, convert it to ISO format
        const date = new Date(preferencesData.party_date);
        scheduledDate = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      } else {
        scheduledDate = new Date().toISOString();
      }

      const requestBody = {
        title: partyTitle,
        scheduledDate: scheduledDate,
        sections: sections,
        timelineEvents: timelineEvents,
        suggestedGifts: suggestedGifts
      };

      console.log("Sending request:", requestBody);

      const response = await savePartyPlan(requestBody).unwrap();

      console.log("Response:", response);

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
      toast.success("Party saved successfully");
    } catch (error) {
      console.error("Failed to save party:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      toast.error("Failed to save party");
    }
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

      {/* Amazon Products Section */}
      {amazonProducts.length > 0 && (
        <>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 border-b border-b-gray-300 pb-3 mb-8">
              🛍️ Recommended Party Supplies
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Enhance your party with these curated products
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {amazonProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="aspect-square w-full h-[300px] bg-gray-100 overflow-hidden">
                    <img
                      src={product?.image_url}
                      alt={product?.title || "Product image"}
                      className="w-full h-[300px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.png';
                      }}
                    />
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 line-clamp-3 leading-snug min-h-[84px]">
                      {product.title?.split(" ").slice(0, 10).join(" ") + (product.title?.split(" ").length > 10 ? "..." : "")}
                    </h3>
                    <a href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF9900] px-6 py-3 font-semibold text-white hover:bg-[#E88B00] transition-colors shadow-md">
                      <ShoppingCart className="h-5 w-5" />
                      Buy Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-16 border-gray-200" />
        </>
      )
      }

      {
        adventure_song_movie_links && adventure_song_movie_links.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-8">
              🎵 Party Music & Entertainment
            </h2>
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
              {adventure_song_movie_links.map((video, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-2xl hover:shadow-primary transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-video w-full bg-gray-200">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.url.split('v=')[1]}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>

                  <div className="p-5">
                    <h3 className="font-extrabold text-lg text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-red-100 text-red-800 px-2.5 py-1 rounded-full font-medium">
                        {video.channel}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        👁️ {parseInt(video.views).toLocaleString()} views
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {video.description}
                    </p>

                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-md"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      <hr className="my-16 border-gray-200" />

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <button
          onClick={handleBackToPreferences}
          className="px-8 py-3 cursor-pointer border-2 border-[#223B7D] text-[#223B7D] rounded-xl font-semibold hover:bg-[#223B7D] hover:text-white transition-all shadow-md"
        >
          🔄 Generate New Plan
        </button>

        <button
          onClick={handleSaveParty}
          disabled={isSaving}
          className={`px-8 py-3 bg-[#223B7D] cursor-pointer text-white rounded-xl font-semibold hover:bg-[#1a2f66] transition-colors shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''
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
              {adventure_song_movie_links?.length || 0}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">Music Videos</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="text-3xl font-extrabold text-[#223B7D]">
              {amazonProducts.length}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">Products</div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default YourPerfectPartyTab;
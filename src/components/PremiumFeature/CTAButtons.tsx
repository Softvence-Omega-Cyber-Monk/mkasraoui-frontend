export default function CTAButtons() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Button Container */}
      <div className="flex flex-wrap justify-center gap-4">
        {/* Compare Features Button */}
        <button className="cursor-pointer rounded-lg border-2 border-gray-300 px-8 py-3 font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50">
          Compare Features
        </button>

        {/* Start Free Trial Button */}
        <button className="cursor-pointer rounded-lg bg-[#80DEEA] px-8 py-3 font-medium text-white transition-colors hover:bg-[#61BFCB]">
          Start Free Trial
        </button>

        {/* Upgrade to Premium Button */}
        <button className="bg-secondary hover:bg-secondary-dark cursor-pointer rounded-lg px-8 py-3 font-medium text-white transition-colors">
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}

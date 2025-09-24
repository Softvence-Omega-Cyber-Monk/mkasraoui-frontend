import { Check } from "lucide-react";

const RequestContent = () => {
  return (
    <div>
      {/* footer */}
      <div className="mt-8 w-full rounded-lg bg-[#D2EAFF] p-6">
        <h2 className="text-secondary mb-4 text-2xl font-semibold">
          What Happens Next?
        </h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              Sweet Dreams Bakery Will Review Your Request Within 24 Hours
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              You'll Receive A Personalized Quote Via Email
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              You Can Then Confirm Or Discuss Any Adjustments
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Check className="text-secondary-dark mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="text-secondary text-base">
              Once Confirmed, Your Party Service Is Booked!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestContent;

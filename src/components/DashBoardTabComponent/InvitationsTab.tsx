import dayjs from "dayjs";
import { useGetPartyPlansQuery } from "@/redux/features/partyGeneration/partyGenerationApi";
function InvitationMetric({
  value,
  label,
  colorClass,
}: {
  value: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default function InvitationsTab() {
  const { data: partyPlans = [], isLoading, isError } = useGetPartyPlansQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10 text-gray-500">
        Loading invitation history...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center p-10 text-red-500">
        Failed to load party invitations.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-center bg-[#FFFFFF] p-8 border border-[#E6E6E6] rounded-2xl">
        <div className="w-full space-y-4">
          <h1 className="mb-6 text-2xl font-bold text-[#000000]">
            Invitation History
          </h1>

          {partyPlans.length === 0 ? (
            <div className="text-center text-gray-500">No invitations found.</div>
          ) : (
            partyPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-lg bg-white p-3 md:p-6 shadow-sm border border-[#B3B3B3]"
              >
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-xs md:text-lg font-semibold text-[#191919]">
                    {plan.title}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {dayjs(plan.scheduledDate).format("DD/MM/YYYY")}
                  </div>
                </div>

                <div className="flex justify-between px-0 md:px-8 content-center gap-4 pt-4">
                  <InvitationMetric
                    value={plan.totalInvitation || 0}
                    label="Sent"
                    colorClass="text-blue-800"
                  />
                  <InvitationMetric
                    value={plan.totalInvitationConfirm || 0}
                    label="Confirmed"
                    colorClass="text-green-600"
                  />
                  <InvitationMetric
                    value={plan.totalInvitationCancel || 0}
                    label="Cancelled"
                    colorClass="text-red-600"
                  />
                  <InvitationMetric
                    value={plan.totalPendingInvitaion || 0}
                    label="Pending"
                    colorClass="text-orange-400"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

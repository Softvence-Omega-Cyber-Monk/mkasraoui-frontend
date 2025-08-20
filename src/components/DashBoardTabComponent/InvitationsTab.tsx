export default function InvitationsTab() {
  const events = [
    {
      id: "1",
      name: "Emma's 7th Birthday",
      date: "20/2/2025",
      sent: 3,
      confirmed: 10,
      secondSent: 1,
      pending: 2,
    },
    {
      id: "2",
      name: "Lucas's Space Party",
      date: "20/2/2025",
      sent: 3,
      confirmed: 10,
      secondSent: 2,
      pending: 1,
    },
    {
      id: "3",
      name: "Emma's 7th Birthday",
      date: "20/2/2025",
      sent: 3,
      confirmed: 10,
      secondSent: 0,
      pending: 4,
    },
  ];

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
      <div className="flex flex-col  items-center ">
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex  items-start justify-center bg-[#FFFFFF] p-8 border border-[#E6E6E6] rounded-2xl">
        <div className="w-full  space-y-4">
          <h1 className="mb-6 text-2xl font-bold text-[#000000]">
            Invitation History
          </h1>
          {events.map((event) => (
            <div key={event.id} className="rounded-lg bg-white p-3 md:p-6 shadow-sm border-1 border-[#B3B3B3]">
              <div className=" flex flex-row items-center justify-between ">
                <h2 className="text-xs md:text-lg font-semibold text-[#191919]">
                  {event.name}
                </h2>
                <div className="text-sm text-gray-500">{event.date}</div>
              </div>
              <div className="flex justify-between px-0 md:px-8 content-center gap-4 pt-4">
                <InvitationMetric
                  value={event.sent}
                  label="Sent"
                  colorClass="text-blue-800"
                />
                <InvitationMetric
                  value={event.confirmed}
                  label="Confirmed"
                  colorClass="text-green-600"
                />
                <InvitationMetric
                  value={event.secondSent}
                  label="Sent"
                  colorClass="text-red-600"
                />
                <InvitationMetric
                  value={event.pending}
                  label="Pending"
                  colorClass="text-orange-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

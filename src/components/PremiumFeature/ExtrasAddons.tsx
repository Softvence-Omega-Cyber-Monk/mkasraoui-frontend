import { X } from "lucide-react";

export default function ExtrasAddons() {
  const services = [
    {
      service: "Group Email Invitations",
      nonSubscriber: "€0.50/guest",
      subscriber: "Up to 10 guests",
    },
    {
      service: "Add Logo to T-shirt",
      nonSubscriber: "€3.00",
      subscriber: "€1.00",
    },
    {
      service: "Guest Response Tracker",
      nonSubscriber: "X",
      subscriber: "AI Table",
    },
    {
      service: "Email Party Reminders + Checklist",
      nonSubscriber: "X",
      subscriber: "Included",
    },
  ];

  return (
    <div className="mx-auto my-16 mt-18 max-w-5xl p-4">
      {/* Container with border */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="bg-white p-8 text-center">
          <h1 className="text-secondary text-3xl font-bold">
            Extras & Add-ons
          </h1>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="">
              <tr>
                <th className="border-b border-gray-200 px-6 py-4 text-left font-semibold text-gray-900">
                  Service
                </th>
                <th className="border-b border-gray-200 px-6 py-4 text-center font-semibold text-gray-900">
                  Non-Subscriber
                </th>
                <th className="border-b border-gray-200 px-6 py-4 text-center font-semibold text-gray-900">
                  Subscriber
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white">
              {services.map((item, index) => (
                <tr
                  key={index}
                  className={
                    index !== services.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {item.service}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.nonSubscriber === "X" ? (
                      <X className="mx-auto h-5 w-5 text-red-500" />
                    ) : (
                      <span className="text-gray-900">
                        {item.nonSubscriber}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-900">{item.subscriber}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { Pencil, Trash } from "lucide-react";

function ServiceTable() {
  const services = [
    {
      id: 1,
      title: "Wedding Photography Package",
      price: "$800 - $1500",
    },
    {
      id: 2,
      title: "Event Videography",
      price: "$500 - $1200",
    },
    {
      id: 3,
      title: "Portrait Photography",
      price: "$300 - $800",
    },
  ];
  return (
    <div className="mx-auto w-full">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Services
          </h1>
          <button className="cursor-pointer rounded-xl bg-[#F0F2F5] px-3 py-2.5 text-sm font-medium text-[#121417] transition-colors hover:bg-gray-100 sm:px-4 sm:py-2">
            Add Service
          </button>
        </div>

        {/* Services Table */}
        <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
          {/* Table Header (hidden on mobile) */}
          <div className="hidden grid-cols-12 items-center gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 sm:grid sm:px-6 sm:py-4">
            <div className="col-span-5">
              <span className="text-xs font-medium text-gray-700 sm:text-sm">
                Service Title
              </span>
            </div>
            <div className="col-span-4">
              <span className="text-xs font-medium text-gray-700 sm:text-sm">
                Price Range
              </span>
            </div>
            <div className="col-span-3 flex justify-end">
              <span className="text-xs font-medium text-gray-700 sm:text-sm">
                Availability
              </span>
            </div>
          </div>

          {/* Service Rows */}
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex flex-col gap-2 px-4 py-3 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6 sm:py-4 ${
                index !== services.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* Service Title */}
              <div className="flex-1 sm:col-span-5">
                <span className="block text-sm font-medium text-gray-900 sm:text-base">
                  {service.title}
                </span>
              </div>

              {/* Price Range */}
              <div className="flex-1 sm:col-span-4">
                <span className="block text-sm font-medium text-green-600 sm:text-base">
                  {service.price}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 sm:col-span-3">
                <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-[#F31260] transition-colors hover:bg-red-50 hover:text-red-600">
                  <Trash className="h-5 w-5" />
                </button>
                <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-black transition-colors hover:bg-gray-50 hover:text-gray-600">
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServiceTable;

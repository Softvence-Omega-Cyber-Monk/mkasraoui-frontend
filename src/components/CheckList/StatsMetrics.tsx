export default function StatsMetrics() {
  const stats = [
    { number: "30%", label: "Complete" },
    { number: "3", label: "Tasks Done" },
    { number: "4", label: "Urgent" },
    { number: "3", label: "Remaining" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg bg-[#E6EFFF] p-6 text-center sm:p-8"
          >
            <div className="text-secondary font-fredoka mb-2 text-4xl font-bold sm:text-5xl">
              {stat.number}
            </div>
            <div className="text-secondary text-base font-semibold sm:text-lg">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

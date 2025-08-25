function TransactionHistoryTable() {
  const transactions = [
    {
      date: "07/15/2024",
      client: "Tech Solutions Inc.",
      amount: "$500",
      status: "Paid",
    },
    {
      date: "07/10/2024",
      client: "Global Marketing LLC",
      amount: "$750",
      status: "Paid",
    },
    {
      date: "07/05/2024",
      client: "Innovative Designs Co.",
      amount: "$400",
      status: "Paid",
    },
    {
      date: "06/30/2024",
      client: "Creative Minds Agency",
      amount: "$300",
      status: "Paid",
    },
    {
      date: "06/25/2024",
      client: "Digital Dynamics Ltd.",
      amount: "$500",
      status: "Paid",
    },
  ];
  return (
    <div>
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-[#121417]">
          Transaction History
        </h2>
      </div>
      {/* table  */}
      <div className="overflow-x-auto rounded-2xl border border-[#DBE0E5]">
        <table className="w-full rounded-2xl border border-[#DBE0E5]">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 uppercase">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 uppercase">
                Client
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium tracking-wider text-gray-700 uppercase">
                Amount
              </th>
              <th className="flex justify-center px-6 py-4 text-left text-sm font-medium tracking-wider whitespace-nowrap text-gray-700 uppercase">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((item, index) => (
              <tr
                key={index}
                className="transition-colors duration-150 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium whitespace-nowrap text-gray-900">
                    {item.client}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {item.amount}
                  </div>
                </td>
                <td className="flex justify-center px-6 py-4">
                  <span className="inline-flex items-center rounded-xl rounded-tr-none bg-[#B8FFC078] px-6 py-2 text-xs font-medium text-[#208D05]">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistoryTable;

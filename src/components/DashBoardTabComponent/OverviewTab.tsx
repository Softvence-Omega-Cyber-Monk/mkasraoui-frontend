import { Calendar, Plus, Star } from "lucide-react";
import { FaListCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";

function OverviewTab() {
  return (
    <div className="">
      <div className=" ">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          {/* Recent Parties Section */}
          <div className="flex flex-col rounded-2xl border-2 border-[#E6E6E6] bg-white">
            <div className="flex flex-row items-center gap-2 p-6 pb-4">
              <Calendar className="h-5 w-5 text-black" />
              <h2 className="text-2xl font-semibold">Recent Parties</h2>
            </div>
            <div className="grid gap-1 p-2 pt-0 lg:p-6">
              {/* Party Item 1 */}
              <div className="flex items-center gap-4 rounded-xl bg-[#F9FAFB] p-3">
                <div className="grid flex-1 gap-0.5">
                  <div className="font text-xs font-semibold md:text-lg">
                    Emma's 7th Birthday
                  </div>
                  <div className="text-xs text-gray-500 md:text-sm">
                    Superhero Adventure
                  </div>
                  <div className="text-xs text-gray-500 md:text-sm">
                    2/15/2024
                  </div>
                </div>
                <span className="mr-4 rounded-full bg-[#BBDEFB] px-3 py-2 text-xs font-medium text-blue-700">
                  Planned
                </span>
              </div>
            </div>
            <div className="mt-auto p-6 pt-4">
              <Link
                to={"/home/party-generator"}
                className="border-input ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-[#E6E6E6] bg-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Plan New Party
              </Link>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="flex flex-col rounded-2xl border-2 border-[#E6E6E6] bg-white">
            <div className="p-6 pb-4">
              <h2 className="text-2xl font-semibold">Quick Actions</h2>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-x-4 gap-y-2 p-6 pt-0 sm:grid-cols-2 md:grid-cols-2">
              <Link
                to={"/home/party-generator"}
                className="border-input ring-offset-background hover:text-accent-foreground focus-visible:ring-ring inline-flex h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-[#E8E8E8] bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <Plus className="mb-3 h-6 w-6" />
                Generate Party
              </Link>
              <Link
                to={"/home/diyboxes"}
                className="border-input ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-[#E8E8E8] bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <Star className="mb-3 h-6 w-6" />
                Browse Boxes
              </Link>
              <Link
                to={"/home/party-invitations"}
                className="border-input ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-[#E8E8E8] bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {/* <Send className="h-6 w-6" /> */}
                <Calendar className="mb-3 h-6 w-6" />
                Send Invitations
              </Link>
              <Link to={"/home/checklist"} className="border-input ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-[#E8E8E8] bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                {/* <ClipboardList className="h-6 w-6 mb-3 " /> */}
                <FaListCheck className="mb-3 h-6 w-6" />
                Check List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;


import allBgImg from "@/assets/party-al-bg.png";
import { useState } from "react";
import OverviewTab from "../DashBoardTabComponent/OverviewTab";
import MyParties from "../DashBoardTabComponent/MyParties";
import InvitationsTab from "../DashBoardTabComponent/InvitationsTab";
import FavositesTab from "../DashBoardTabComponent/FavositesTab";
import ProfileTab from "../DashBoardTabComponent/ProfileTab";
export default function PartyInvitations() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { id: "Overview", label: "Overview" },
    { id: "My Parties", label: "My Parties" },
    { id: "Invitations", label: "Invitations" },
    { id: "Favourite", label: "Favourite" },
    { id: "Profile", label: "Profile" },
    // { id: "reviews", label: "Reviews" },
  ];






  // this is tab content
  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="">
            <div className="">
            <OverviewTab/>
            </div>
          </div>
        );
      case "My Parties":
        return (
          <div className="">
         <MyParties/>
          </div>
        );
      case "Invitations":
        return (
          <div className="">
           <InvitationsTab/>
          </div>
        );
        case "Favourite": return(
          <div>
            <FavositesTab/>
          </div>
        );
        case "Profile" : 
        return(
          <div>
           <ProfileTab/>
          </div>
        )
      default:
        return null;
    }
  };

  // this is   a main  part
  return (
    <div className="pb-2 md:pb-20">
      {/* bg-banner here  */}
    
    
      {/* here is the my tab  */}
      <div className="relative mt-1 h-full">
        {/* Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url(${allBgImg})` }}
        ></div>

        {/* Foreground Content */}
        <div className="relative z-10  mt-4 container mx-auto  px-4">
          <div className="overflow-hidden rounded-lg p-2">
            {/* Tab Navigation */}
            <div className="flex overflow-x-scroll rounded-xl border-b border-gray-200 bg-[#F5F5F5] p-2 md:overflow-x-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 cursor-pointer px-6 py-3 text-center whitespace-nowrap font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "rounded-md bg-[#223B7D] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-10 bg-white">{renderContent()}</div>
          </div>
        </div>
      </div>
      {/* teb section  */}
      {/* here add Love (this theme?) section */}
    </div>
  );
}

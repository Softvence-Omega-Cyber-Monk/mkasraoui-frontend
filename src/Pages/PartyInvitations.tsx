import inviteImg3 from "@/assets/box-img-3.jpg";
import inviteImg1 from "@/assets/inviteimg-1.jpg";
import inviteImg2 from "@/assets/inviteIMG-2.png";
import inviteImg4 from "@/assets/inviteImg-4.jpg";
import allBgImg from "@/assets/party-al-bg.png";
import MyHeader from "@/components/MyHeader/MyHeader";
import ManageRSVPsTab from "@/components/Party Invitations/Tab/ManageRSVPsTab";
import {
  Calendar,
  ChevronDown,
  Download,
  Mail,
  MapPin,
  Share2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PartyInvitations() {
  const [activeTab, setActiveTab] = useState("Create Invitation");
  const [, setSelectedTemplate] = useState<string | null>(null);

  const tabs = [
    { id: "Create Invitation", label: "Create Invitation" },
    { id: "Preview & Send", label: "Preview & Send" },
    { id: "Manage RSVPs", label: "Manage RSVPs" },
    // { id: "reviews", label: "Reviews" },
  ];

  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
  const [partyDetails, setPartyDetails] = useState({
    childName: "",
    age: "",
    partyDate: "",
    location: "",
    rsvpContact: "",
    customMessage: "",
  });

  const ages = Array.from({ length: 80 }, (_, i) => i + 1);

  const handleInputChange = (
    field: keyof typeof partyDetails,
    value: string,
  ) => {
    setPartyDetails({
      ...partyDetails,
      [field]: value,
    });
  };

  const handleAgeSelect = (age: number) => {
    handleInputChange("age", age.toString());
    setIsAgeDropdownOpen(false);
  };

  // Inside your PartyInvitations component, before renderContent()
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    partyDetails.partyDate ? new Date(partyDetails.partyDate) : null,
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    // Save as yyyy-MM-dd (like <input type="date" /> would do)
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    handleInputChange("partyDate", formattedDate);
  };
  // this handler for go to next tab renderContent()

  //  this is handel previous button for go back
  const handleBack = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  // this handle function for go data in the backend
  const handleNext = () => {
    // Define required fields and their messages
    const requiredFields: { key: keyof typeof partyDetails; label: string }[] =
      [
        { key: "childName", label: "Child's Name" },
        { key: "age", label: "Age" },
        { key: "partyDate", label: "Party Date" },
        { key: "location", label: "Location" },
        { key: "rsvpContact", label: "RSVP Contact" },
      ];

    for (const field of requiredFields) {
      const value = partyDetails[field.key];

      // check empty or only spaces
      if (!value || (typeof value === "string" && value.trim() === "")) {
        Swal.fire({
          icon: "warning",
          title: "Required Field",
          html: `Please fill in <strong>${field.label}</strong> before continuing.`,
          confirmButtonColor: "#3085d6",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            htmlContainer: "swal-html-container",
            confirmButton: "swal2-confirm",
          },
        });
        return; // stop here
      }
    }
    console.log("hi dev All Party Details:", partyDetails);
    // ✅ All fields valid → go to next tab
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  // data for the last atb
  const templates = [
    {
      id: "superhero",
      title: "Superhero Adventure",
      description: "Bold and heroic design with comic elements",
      imageUrl: inviteImg1,
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
    },
    {
      id: "princess",
      title: "Princess Castle",
      description: "Elegant and magical with royal elements",
      imageUrl: inviteImg2,
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
    },
    {
      id: "dinosaur",
      title: "Dinosaur Discovery",
      description: "Prehistoric adventure with fossil patterns",
      imageUrl: inviteImg3,
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
    },
    {
      id: "space",
      title: "Space Explorer",
      description: "Cosmic design with stars and planets",
      imageUrl: inviteImg4,
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
    },
  ];
  //   this data for last atb
  const [guests, setGuests] = useState([
    {
      id: "1",
      name: "Emma Johnson",
      email: "emma@email.com",
      phone: "555-0123",
      status: "pending",
    },
    {
      id: "2",
      name: "Emma Johnson",
      email: "emma@email.com",
      phone: "555-0123",
      status: "confirmed",
    },
    {
      id: "3",
      name: "Emma Johnson",
      email: "emma@email.com",
      phone: "555-0123",
      status: "declined",
    },
  ]);

  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleAddGuest = () => {
    if (newGuest.name && newGuest.email && newGuest.phone) {
      const guest = {
        id: Date.now().toString(),
        ...newGuest,
        status: "pending",
      };
      setGuests([...guests, guest]);
      setNewGuest({ name: "", email: "", phone: "" });
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // this is tab content
  const renderContent = () => {
    switch (activeTab) {
      case "Create Invitation":
        return (
          <div className="">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Choose Template Section */}
                <div className="rounded-2xl border-2 border-[#E6E6E6] bg-white p-5">
                  <h2 className="mb-6 text-2xl font-semibold text-[#000000]">
                    Choose Template
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative cursor-pointer rounded-xl border-2 border-[#223B7D] bg-[#FFF7ED] transition-all duration-200`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="aspect-video h-52 w-full overflow-hidden rounded-t-lg">
                          <img
                            src={template.imageUrl}
                            alt={template.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4 pb-6">
                          <h3 className="mb-1 text-xl font-medium text-gray-900">
                            {template.title}
                          </h3>
                          <p className="mb-3 text-sm text-gray-600">
                            {template.description}
                          </p>
                          <div className="flex space-x-1">
                            {template.colors.map((color, index) => (
                              <div
                                key={index}
                                className={`h-3 w-3 rounded-full ${color}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Party Details Section */}
                <div className="rounded-2xl border-2 border-[#E6E6E6] bg-white p-5">
                  <h2 className="mb-6 text-2xl font-semibold text-[#000000]">
                    Party Details
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Child's Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your you name"
                        required
                        className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={partyDetails.childName}
                        onChange={(e) =>
                          handleInputChange("childName", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Age
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-lg border border-[#CECECE] bg-white px-3 py-2 text-left focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          onClick={() =>
                            setIsAgeDropdownOpen(!isAgeDropdownOpen)
                          }
                        >
                          <span
                            className={
                              partyDetails.age
                                ? "text-gray-900"
                                : "text-gray-500"
                            }
                          >
                            {partyDetails.age || "Select age"}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {isAgeDropdownOpen && (
                          <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-[#CECECE] bg-white shadow-lg">
                            {ages.map((age) => (
                              <button
                                key={age}
                                type="button"
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                onClick={() => handleAgeSelect(age)}
                              >
                                {age}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Party Date
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          className="w-full rounded-lg border border-[#CECECE] px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          wrapperClassName="w-full" // 👈 THIS makes the wrapper stretch full width
                        />
                        <Calendar className="pointer-events-none absolute top-2.5 right-3 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="party address"
                        className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={partyDetails.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        RSVP Contact
                      </label>
                      <input
                        type="text"
                        placeholder="Phone number or email"
                        className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={partyDetails.rsvpContact}
                        onChange={(e) =>
                          handleInputChange("rsvpContact", e.target.value)
                        }
                        onBlur={() => {
                          const value = partyDetails.rsvpContact.trim();

                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          const phoneRegex = /^\+?[0-9]{7,15}$/;

                          if (
                            value &&
                            !emailRegex.test(value) &&
                            !phoneRegex.test(value)
                          ) {
                            alert(
                              "Please enter a valid phone number or email address.",
                            );
                          }
                        }}
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          Custom Message
                        </label>
                        <button className="flex cursor-pointer items-center rounded-sm border border-[#C3C3C3] px-6 py-2 text-sm text-[#223B7D] hover:text-blue-700">
                          <Sparkles className="h-4 w-4" />
                          <span>AI Suggest</span>
                        </button>
                      </div>
                      <textarea
                        placeholder="Add a personal message to your invitation..."
                        rows={4}
                        className="w-full resize-none rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={partyDetails.customMessage}
                        onChange={(e) =>
                          handleInputChange("customMessage", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleNext}
                        className="hover:bg-secondary-light cursor-pointer rounded-md bg-[#223B7D] px-6 py-3 text-white transition-all duration-300"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Preview & Send":
        return (
          <div className="">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Invitation Preview */}
              <div>
                <div className="rounded-3xl border border-[#E5E5E5] bg-white shadow-sm">
                  <div className="p-6 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Invitation Preview
                    </h2>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="relative">
                      {/* Gradient border wrapper */}
                      <div className="rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 p-6">
                        <div className="rounded-xl bg-white p-8 text-center">
                          {/* Party icon */}
                          <div className="mb-4 flex justify-center">
                            <div className="text-4xl">🎉</div>
                          </div>

                          {/* Main heading */}
                          <h2 className="mb-2 text-2xl font-bold text-[#223B7D]">
                            You're Invited!
                          </h2>

                          {/* Subtitle */}
                          <p className="mb-6 text-base font-medium text-gray-700">
                            Child's Name is turning X!
                          </p>

                          {/* Date and Location */}
                          <div className="mb-6 space-y-3">
                            <div className="flex items-center justify-center gap-2 text-gray-700">
                              <Calendar className="h-5 w-5" />
                              <span className="text-base font-medium">
                                Date at Time
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-gray-700">
                              <MapPin className="h-5 w-5" />
                              <span className="text-base font-medium">
                                Location
                              </span>
                            </div>
                          </div>

                          {/* Custom message */}
                          <p className="mb-3 bg-[#F9FAFB] py-2 text-sm text-gray-500 italic">
                            Your custom message will appear here...
                          </p>

                          {/* RSVP */}
                          <p className="text-sm text-gray-700">
                            RSVP: Contact info
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Send Invitations */}
              <div className="space-y-8">
                <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <div className="p-6 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Send Invitations
                    </h2>
                  </div>
                  <div className="space-y-4 px-6 pb-6">
                    <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#223B7D] font-normal text-white transition-colors hover:bg-blue-900">
                      <Mail className="text-sm" />
                      Send Via Email
                    </button>

                    <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white font-normal text-[#223B7D] transition-colors hover:bg-gray-50">
                      <Download className="text-sm" />
                      Download PDF
                    </button>

                    <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white font-normal text-[#223B7D] transition-colors hover:bg-gray-50">
                      <Share2 className="text-sm" />
                      Share Link
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Quick Stats
                    </h2>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-[#FAF5FF] p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-[#FD8EFF]">
                          50
                        </div>
                        <div className="text-sm text-gray-700">
                          Total Guests
                        </div>
                      </div>
                      <div className="rounded-lg bg-[#AEF4B85C] p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-[#36B37E]">
                          40
                        </div>
                        <div className="text-sm text-gray-700">Confirmed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleBack}
                type="button"
                className="cursor-pointer rounded-md border border-[#C9C9C9] px-6 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                className="cursor-pointer rounded-md bg-[#223B7D] px-6 py-3 text-white transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        );
      case "Manage RSVPs":
        return (
          <div>
            <ManageRSVPsTab
              guests={guests}
              newGuest={newGuest}
              setNewGuest={setNewGuest}
              handleAddGuest={handleAddGuest}
              getStatusStyles={getStatusStyles}
              handleBack={handleBack}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // this is   a main  part
  return (
    <div className="pb:0 md:pb-20">
      {/* bg-banner here  */}{" "}
      <MyHeader
        title="Party Invitations"
        subtitle=" Create beautiful invitations and manage your guest list effortlessly"
        className="font-fredoka text-3xl leading-snug font-bold sm:text-5xl md:text-6xl"
      />
      {/* here is the my tab  */}
      <div className="relative mt-1">
        {/* Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url(${allBgImg})` }}
        ></div>

        {/* Foreground Content */}
        <div className="relative z-10 mx-auto mt-4 max-w-7xl px-4">
          <div className="overflow-hidden rounded-lg p-2">
            {/* Tab Navigation */}
            <div className="flex overflow-x-scroll rounded-xl border-b border-gray-200 bg-[#F5F5F5] p-2 md:overflow-x-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 cursor-pointer px-6 py-3 text-center text-xs font-medium transition-colors duration-200 md:text-lg ${
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

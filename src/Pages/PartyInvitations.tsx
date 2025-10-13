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
  Copy,
  Download,
  Mail,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGenerateCardMutation } from "@/redux/features/generateCard/generateCard";
import { useSendInvitationMutation } from "@/redux/features/invitations/invitationsApi";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { useGetPartyPlansQuery } from "@/redux/features/partyGeneration/partyGenerationApi";
import { useGenerateMessageMutation } from "@/redux/features/generatedMessage/generatedMessageApi";

export default function PartyInvitations() {
  const [activeTab, setActiveTab] = useState("Create Invitation");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Redux mutation hook
  const [generateCard, { isLoading: isGenerating, error: generateError }] = useGenerateCardMutation();
  const [sendInvitation, { isLoading }] = useSendInvitationMutation();
  // const [deleteInvitation] = useDeleteInvitationMutation();
  // const { getInvitations } = useGetInvitationsQuery();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const { data: parties } = useGetPartyPlansQuery();

  const [generateMessageApi, { isLoading: isGeneratingMessage }] = useGenerateMessageMutation();

  const [partyDetails, setPartyDetails] = useState({
    selectedPartyId: "",
    childName: "",
    age: 0,
    partyDate: "",
    partyTime: "",
    gender: "",
    location: "",
    rsvpContact: "",
    description: "",
  });

  const handleDownloadPDF = () => {
    if (!generatedImageUrl) {
      toast.error("Please Generate Image First");
      return
    }
    const pdf = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.crossOrigin = "anonymous"; // to avoid CORS issue
    img.src = generatedImageUrl!;

    img.onload = () => {
      const imgWidth = 190; // fit image to page width
      const imgHeight = (img.height * imgWidth) / img.width;
      pdf.addImage(img, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("invitation.pdf");
    };
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    if (!generatedImageUrl) {
      toast.error("Please Generate Image First");
      return
    }
    navigator.clipboard.writeText(generatedImageUrl!).then(() => {
      toast.success("URL Copied to Clipboard");
    });
  };

  const [formData, setFormData] = useState({
    email: "",
    guest_name: "",
    quest_phone: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendInvitation({
        email: formData.email,
        guest_name: formData.guest_name,
        quest_phone: formData.quest_phone,
        imageUrl: generatedImageUrl!,
        party_id: partyDetails.selectedPartyId!,
      }).unwrap();
      setShowPopup(false);
      toast.success("Invitation sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send invitation");
    }
  };

  const tabs = [
    { id: "Create Invitation", label: "Create Invitation" },
    { id: "Preview & Send", label: "Preview & Send" },
    { id: "Manage RSVPs", label: "Manage RSVPs" },
  ];

  const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);




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

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    partyDetails.partyDate ? new Date(partyDetails.partyDate) : null,
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    handleInputChange("partyDate", formattedDate);
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleGenerateMessage = async () => {
    if (!partyDetails.childName || !partyDetails.age || !partyDetails.gender) {
      toast.error("Please fill at least name, age, and gender before generating message.");
      return;
    }
    try {
      const response = await generateMessageApi({
        theme: "Birthday",
        description: partyDetails.description || "",
        age: partyDetails.age,
        gender: partyDetails.gender,
        birthday_person_name: partyDetails.childName,
        venue: partyDetails.location || "",
        date: partyDetails.partyDate || "",
        time: partyDetails.partyTime || "",
        contact_info: partyDetails.rsvpContact || "",
      }).unwrap();
      handleInputChange("description", response.invitation_Message);

    } catch (error) {
      console.error(error);
      toast.error("Message Generation Failed");
    }
  };

  // Handle AI generation
  const handleGenerateCard = async () => {
    if (!partyDetails.description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Message Required",
        html: "Please enter a custom message to generate the card.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const result = await generateCard({
        theme: selectedTemplate!,
        description: partyDetails.description,
        age: partyDetails.age,
        gender: partyDetails.gender,
        birthday_person_name: partyDetails.childName,
        venue: partyDetails.location,
        date: partyDetails.partyDate,
        time: partyDetails.partyTime,
        contact_info: partyDetails.rsvpContact
      }).unwrap();

      console.log(result)
      setGeneratedImageUrl(result.images[0].url);
      Swal.fire({
        icon: "success",
        title: "Card Generated!",
        text: "Your custom invitation card has been created.",
        confirmButtonColor: "#223B7D",
      });
      handleNext()
    } catch (error) {
      console.error("Failed to generate card:", error);
      Swal.fire({
        icon: "error",
        title: "Generation Failed",
        text: "Unable to generate the card. Please try again.",
        confirmButtonColor: "#223B7D",
      });
    }
  };

  const handleNext = () => {
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
        return;
      }
    }

    console.log("All Party Details:", partyDetails);
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

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
                        className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${selectedTemplate === template.id
                          ? "border-[#223B7D] bg-[#FFF7ED]"
                          : "border-[#E6E6E6] bg-white hover:border-[#223B7D]"
                          }`}
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

                  {/* Generated Card Display */}
                  {generatedImageUrl && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-lg font-semibold text-[#000000]">
                        AI Generated Card
                      </h3>
                      <div className="overflow-hidden rounded-xl border-2 border-[#223B7D]">
                        <img
                          src={generatedImageUrl}
                          alt="Generated invitation card"
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Party Details Section */}
                <div className="rounded-2xl border-2 border-[#E6E6E6] bg-white p-5">
                  <h2 className="mb-6 text-2xl font-semibold text-[#000000]">
                    Party Details
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Select Party
                      </label>
                      <select
                        className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={partyDetails.selectedPartyId || ""}
                        onChange={(e) =>
                          handleInputChange("selectedPartyId", e.target.value)
                        }
                      >
                        <option value="">-- Select a Party --</option>
                        {parties?.map((party) => (
                          <option key={party.id} value={party.id}>
                            {party.title} - {new Date(party.scheduledDate).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Child's Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        required
                        className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={partyDetails.childName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z\s]*$/.test(value)) {
                            handleInputChange("childName", value);
                          }
                        }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
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
                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <input
                          type="text"
                          placeholder="Gender"
                          className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={partyDetails.gender}
                          onChange={(e) =>
                            handleInputChange("gender", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-7">
                      <div className="flex-1">
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
                            wrapperClassName="w-full"
                          />
                          <Calendar className="pointer-events-none absolute top-2.5 right-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Party Time
                        </label>
                        <input
                          type="text"
                          placeholder="Party Time"
                          className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={partyDetails.partyTime}
                          onChange={(e) =>
                            handleInputChange("partyTime", e.target.value)
                          }
                        />
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
                            toast.error(
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
                        <button
                          type="button"
                          onClick={handleGenerateMessage}
                          disabled={isGeneratingMessage}
                          className="flex cursor-pointer items-center rounded-sm border border-[#C3C3C3] px-6 py-2 text-sm text-[#223B7D] hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>
                            {isGenerating ? "Generating..." : "AI Suggest"}
                          </span>
                        </button>
                      </div>
                      <textarea
                        placeholder="Add a personal message to your invitation..."
                        rows={4}
                        className="w-full resize-none rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={partyDetails.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                      {generateError && (
                        <p className="mt-1 text-sm text-red-600">
                          Failed to generate card. Please try again.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleGenerateCard}
                        disabled={isGenerating}
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
                      <img src={generatedImageUrl!} />
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
                    <button
                      onClick={() => setShowPopup(true)}
                      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#223B7D] font-normal text-white transition-colors hover:bg-blue-900"
                    >
                      <Mail className="text-sm" />
                      Send Via Email
                    </button>

                    <button onClick={handleDownloadPDF} className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white font-normal text-[#223B7D] transition-colors hover:bg-gray-50">
                      <Download className="text-sm" />
                      Download PDF
                    </button>

                    <button onClick={handleCopyLink} className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white font-normal text-[#223B7D] transition-colors hover:bg-gray-50">
                      <Share2 className="text-sm" />
                      Share Link
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Quick Stats
                    </h2>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-[#FAF5FF] p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-[#FD8EFF]">
                          {guests.length}
                        </div>
                        <div className="text-sm text-gray-700">Total Guests</div>
                      </div>
                      <div className="rounded-lg bg-[#AEF4B85C] p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-[#36B37E]">
                          {guests.filter((g) => g.status === "confirmed").length}
                        </div>
                        <div className="text-sm text-gray-700">Confirmed</div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Navigation Buttons */}
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

            {/* Popup Form */}
            {showPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                  <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPopup(false)}
                  >
                    <X />
                  </button>
                  <h3 className="mb-4 text-xl font-semibold">Send Invitation</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                    <input
                      type="text"
                      name="guest_name"
                      placeholder="Guest Name"
                      value={formData.guest_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                    <input
                      type="text"
                      name="quest_phone"
                      placeholder="Guest Phone"
                      value={formData.quest_phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-md bg-[#223B7D] p-2 text-white hover:bg-blue-900 transition-colors cursor-pointer"
                    >
                      {isLoading ? "Sending..." : "Send Invitation"}
                    </button>
                  </form>
                </div>
              </div>
            )}
            {showCopyPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
                  <h3 className="text-lg font-semibold mb-4">Share Invitation</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={generatedImageUrl!}
                      readOnly
                      className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 px-3 py-2 bg-[#223B7D] text-white rounded-lg hover:bg-blue-900"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>

                  <button
                    onClick={() => setShowCopyPopup(false)}
                    className="mt-4 w-full rounded-lg border border-gray-300 bg-gray-100 py-2 hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case "Manage RSVPs":
        return (
          <div>
            <ManageRSVPsTab
              handleBack={handleBack}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb:0 md:pb-20">
      <MyHeader
        title="Party Invitations"
        subtitle="Create beautiful invitations and manage your guest list effortlessly"
        className="font-fredoka text-3xl leading-snug font-bold sm:text-5xl md:text-6xl"
      />
      <div className="relative mt-1">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url(${allBgImg})` }}
        ></div>
        <div className="relative z-10 mx-auto mt-4 max-w-7xl px-4">
          <div className="overflow-hidden rounded-lg p-2">
            <div className="flex overflow-x-scroll rounded-xl border-b border-gray-200 bg-[#F5F5F5] p-2 md:overflow-x-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 cursor-pointer px-6 py-3 text-center text-xs font-medium transition-colors duration-200 md:text-lg ${activeTab === tab.id
                    ? "rounded-md bg-[#223B7D] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-10 bg-white">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
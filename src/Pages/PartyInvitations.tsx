import allBgImg from "@/assets/party-al-bg.png";
import MyHeader from "@/components/MyHeader/MyHeader";
import ManageRSVPsTab from "@/components/Party Invitations/Tab/ManageRSVPsTab";
import {
  Calendar,
  ChevronDown,
  Copy,
  Download,
  Mail,
  Package,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGenerateCardMutation } from "@/redux/features/generateCard/generateCard";
import { useSendInvitationMutation } from "@/redux/features/invitations/invitationsApi";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { useGetPartyPlansQuery } from "@/redux/features/partyGeneration/partyGenerationApi";
import { useGenerateMessageMutation } from "@/redux/features/generatedMessage/generatedMessageApi";
import spidermanImage from "../../public/template_images/spiderman.png";
import batmanImage from "../../public/template_images/batman.png";
import laReineImage from "../../public/template_images/lareine.png";
import princessDisneyImage from "../../public/template_images/princess_disney.png";
import pokemonImage from "../../public/template_images/pokemon.png";
import astronomyImage from "../../public/template_images/astronomy.webp";
import barbieImage from "../../public/template_images/barbie.png";
import patPatrouilleImage from "../../public/template_images/pat.png";
import piratesImage from "../../public/template_images/pirates.png";
import marvelImage from "../../public/template_images/marvel.png";
import superheroesImage from "../../public/template_images/superheroes.png";
import safariImage from "../../public/template_images/safari.png";
import dinosaursImage from "../../public/template_images/dinasoures.png";
import licornesImage from "../../public/template_images/licornes.png";
import gabbyImage from "../../public/template_images/gabby.png";
import { ClipLoader } from "react-spinners";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { useCreatePrintOrderMutation } from "@/redux/features/printCard/printCard";


export default function PartyInvitations() {
  const [activeTab, setActiveTab] = useState("Create Invitation");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { data: userData } = useGetMeQuery();
  const isNotAdmin = userData?.role !== "ADMIN";
  const hasPremium = userData?.subscription?.some(plan => plan.plan_name === "Premium Subscriber");
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const limitOver = !hasPremium && userData?.total_party_generated! >= 1 && isNotAdmin;

  const [createPrintOrder, { isLoading: isCreatingPrintOrder }] = useCreatePrintOrderMutation();

  // Redux mutation hook
  const [generateCard, { isLoading: isGenerating, error: generateError }] = useGenerateCardMutation();
  const [sendInvitation, { isLoading }] = useSendInvitationMutation();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showZelatoPopup, setShowZelatoPopup] = useState(false)
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
    language: ""
  });

  const handleDownloadPDF = () => {
    if (!generatedImageUrl) {
      toast.error("Please Generate Image First");
      return
    }
    const pdf = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = generatedImageUrl!;

    img.onload = () => {
      const imgWidth = 190;
      const imgHeight = (img.height * imgWidth) / img.width;
      pdf.addImage(img, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("invitation.pdf");
    };
  };

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
    guest_phone: "",
  });

  const [shippingFormData, setShippingFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
  })

  const handleZelatoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!generatedImageUrl) {
      toast.error("Please generate an invitation first");
      return;
    }

    // Validate shipping form
    if (!shippingFormData.firstName || !shippingFormData.lastName ||
      !shippingFormData.addressLine1 || !shippingFormData.city ||
      !shippingFormData.state || !shippingFormData.postcode ||
      !shippingFormData.country) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    try {
      const response = await createPrintOrder({
        imageUrl: generatedImageUrl,
        packQuantity: 1, // Default to 1 pack (10 cards)
        total: 20.66, // You can make this dynamic or configurable
        contactName: `${shippingFormData.firstName} ${shippingFormData.lastName}`,
        contactPhone: formData.guest_phone || "", // Use guest phone or make a separate field
        contactEmail: formData.email || "", // Use guest email or make a separate field
        addressLine1: shippingFormData.addressLine1,
        addressLine2: shippingFormData.addressLine2,
        postCode: shippingFormData.postcode,
        city: shippingFormData.city,
        state: shippingFormData.state,
        country: shippingFormData.country,
      }).unwrap();

      console.log(response)
      // Redirect to Stripe Checkout
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }

      setShowZelatoPopup(false);
      toast.success("Redirecting to checkout...");

      // Reset form
      setShippingFormData({
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create print order");
    }
  };

  // Add handler for shipping form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingFormData({
      ...shippingFormData,
      [e.target.name]: e.target.value
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendInvitation({
        email: formData.email,
        guest_name: formData.guest_name,
        guest_phone: formData.guest_phone,
        imageUrl: generatedImageUrl!,
        party_id: partyDetails.selectedPartyId!,
      }).unwrap();
      setShowPopup(false);
      toast.success("Invitation sent successfully!");
      // Reset form
      setFormData({
        email: "",
        guest_name: "",
        guest_phone: ""
      });
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
        language: partyDetails.language || "en"
      }).unwrap();
      handleInputChange("description", response.invitation_Message);

    } catch (error) {
      console.error(error);
      toast.error("Message Generation Failed");
    }
  };

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

    if (!partyDetails.selectedPartyId) {
      Swal.fire({
        icon: "warning",
        title: "Party Selection Required",
        html: "Please select a party before generating the card.",
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
        contact_info: partyDetails.rsvpContact,
        language: partyDetails.language || "en"
      }).unwrap();

      console.log(result)
      setGeneratedImageUrl(result?.images[0]?.url);
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
      id: "spiderman",
      title: "Spider-man",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: spidermanImage,
    },
    {
      id: "batman",
      title: "Batman",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: batmanImage,
    },
    {
      id: "la_reine_des_neiges",
      title: "La Reine des Neiges",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: laReineImage,
    },
    {
      id: "princesses_disney",
      title: "Princesses Disney",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: princessDisneyImage,
    },
    {
      id: "pokemon",
      title: "Pokemon",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: pokemonImage,
    },
    {
      id: "astronomie",
      title: "Espace / Astronomie",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: astronomyImage,
    },
    {
      id: "barbie",
      title: "Barbie",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: barbieImage,
    },
    {
      id: "pat_patrouille",
      title: "Pat' Patrouille",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: patPatrouilleImage,
    },
    {
      id: "pirates",
      title: "Pirates and chasse au tresor",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: piratesImage,
    },
    {
      id: "marvel",
      title: "Marvel / Avengers",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: marvelImage,
    },
    {
      id: "superheroes",
      title: "Super-heroes",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: superheroesImage,
    },
    {
      id: "jungle",
      title: "Safari / Jungle",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: safariImage,
    },
    {
      id: "dinasaures",
      title: "Dinasaures",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: dinosaursImage,
    },
    {
      id: "licornes_magiques",
      title: "Licornes magiques",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: licornesImage,
    },
    {
      id: "gabby",
      title: "Gabby",
      colors: ["bg-[#80DEEA]", "bg-[#FF5630]", "bg-[#FFD54F]"],
      image: gabbyImage,
    },
  ];
  const renderLoadingSpinner = () => (
    <div className="absolute inset-0 flex justify-center items-center z-50 backdrop-shadow-lg bg-white/70 flex-col gap-4 rounded-xl h-full">
      <ClipLoader size={50} color="red" loading={true} />
    </div>
  );
  const renderContent = () => {
    if (isGenerating || isGeneratingMessage) {
      return renderLoadingSpinner(); // Show spinner when loading
    }
    switch (activeTab) {
      case "Create Invitation":
        return (
          <div className="">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Choose Template Section */}
                <div className="rounded-2xl border-2 border-[#E6E6E6] bg-white p-5 md:max-h-[105vh] md:overflow-y-auto pb-10">
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
                        <div className="p-4 pb-6">
                          <div className="flex justify-center items-center">
                            <img
                              src={template.image}
                              alt={template.title}
                              className="h-36 object-cover rounded-md py-5"
                            />
                          </div>
                          <h3 className="mb-1 text-xl font-medium text-gray-900">
                            {template.title}
                          </h3>
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
                        className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                        value={partyDetails.selectedPartyId || ""}
                        required
                        onChange={(e) =>
                          handleInputChange("selectedPartyId", e.target.value)
                        }
                      >
                        <option value="" disabled selected>
                          Select a party
                        </option>
                        {parties?.map((party) => (
                          <option key={party.id} value={party.id} className="cursor-pointer">
                            {party.title} - {new Date(party.scheduledDate).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Name
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

                    <div className="flex gap-2">
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
                          type="time"
                          placeholder="Party Time"
                          className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={partyDetails.partyTime}
                          onChange={(e) => handleInputChange("partyTime", e.target.value)}
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

                    <div className="flex justify-between gap-2">
                      <div className="flex-1">
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
                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Language
                        </label>
                        <input
                          type="text"
                          placeholder="en/fr"
                          className="w-full rounded-lg border border-[#CECECE] px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={partyDetails.language}
                          onChange={(e) =>
                            handleInputChange("language", e.target.value)
                          }
                        />
                      </div>
                      
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
                        disabled={isGenerating || limitOver}
                        className={`rounded-md ${limitOver ? `bg-blue-400` : `bg-[#223B7D] cursor-pointer hover:bg-secondary-light`} px-6 py-3 text-white transition-all duration-300`}
                      >
                        {limitOver ? "Upgrade to Premium" : isGenerating ? "Generating..." : "Next"}
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

                    <button
                      onClick={() => setShowZelatoPopup(true)}
                      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 font-normal text-blue-900 transition-colors hover:bg-gray-50"
                    >
                      <Package className="text-sm" />
                      Deliver Through Zelato
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

            {showZelatoPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
                  <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowZelatoPopup(false)}
                  >
                    <X />
                  </button>
                  <h3 className="mb-6 text-2xl font-semibold">Order Physical Cards via Zelato</h3>
                  <form onSubmit={handleZelatoSubmit} className="space-y-4">
                    {/* Order Details */}
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-700">Order Details</h4>
                      <p className="text-sm text-gray-600">Pack of 10 cards - €20.66</p>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-700">Contact Information</h4>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="text"
                        name="guest_phone"
                        placeholder="Phone Number *"
                        value={formData.guest_phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="text-lg font-medium text-gray-700">Shipping Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name *"
                          value={shippingFormData.firstName}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name *"
                          value={shippingFormData.lastName}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <input
                        type="text"
                        name="addressLine1"
                        placeholder="Address Line 1 *"
                        value={shippingFormData.addressLine1}
                        onChange={handleShippingChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="text"
                        name="addressLine2"
                        placeholder="Address Line 2 (Optional)"
                        value={shippingFormData.addressLine2}
                        onChange={handleShippingChange}
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City *"
                          value={shippingFormData.city}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State/Province *"
                          value={shippingFormData.state}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="postcode"
                          placeholder="Postcode *"
                          value={shippingFormData.postcode}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <input
                          type="text"
                          name="country"
                          placeholder="Country Code (e.g., FR, US) *"
                          value={shippingFormData.country}
                          onChange={handleShippingChange}
                          required
                          maxLength={2}
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 uppercase"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isCreatingPrintOrder}
                      className="w-full rounded-lg bg-[#223B7D] p-3 text-white hover:bg-blue-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                      {isCreatingPrintOrder ? "Processing..." : "Proceed to Checkout (€20.66)"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Popup Form */}
            {showPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
                  <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => setShowPopup(false)}
                  >
                    <X />
                  </button>
                  <h3 className="mb-6 text-2xl font-semibold">Send Invitation</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Guest Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-700">Guest Information</h4>
                      <input
                        type="email"
                        name="email"
                        placeholder="Guest Email *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="text"
                        name="guest_name"
                        placeholder="Guest Name *"
                        value={formData.guest_name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="text"
                        name="guest_phone"
                        placeholder="Guest Phone *"
                        value={formData.guest_phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    {/* Shipping Address */}
                    {/* <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="text-lg font-medium text-gray-700">Shipping Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name *"
                          value={formData.shippingAddress.firstName}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name *"
                          value={formData.shippingAddress.lastName}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <input
                        type="text"
                        name="addressLine1"
                        placeholder="Address Line 1 *"
                        value={formData.shippingAddress.addressLine1}
                        onChange={handleShippingChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <input
                        type="text"
                        name="addressLine2"
                        placeholder="Address Line 2 (Optional)"
                        value={formData.shippingAddress.addressLine2}
                        onChange={handleShippingChange}
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City *"
                          value={formData.shippingAddress.city}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State *"
                          value={formData.shippingAddress.state}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="postcode"
                          placeholder="Postcode *"
                          value={formData.shippingAddress.postcode}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <input
                          type="text"
                          name="country"
                          placeholder="Country *"
                          value={formData.shippingAddress.country}
                          onChange={handleShippingChange}
                          required
                          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div> */}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-lg bg-[#223B7D] p-3 text-white hover:bg-blue-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
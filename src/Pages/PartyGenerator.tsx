/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import allBgImg from "@/assets/party-al-bg.png";
import { FiChevronDown } from "react-icons/fi";
import MyHeader from "@/components/MyHeader/MyHeader";
import Swal from "sweetalert2";
import YourPerfectPartyTab from "@/components/AI Party Generator/YourPerfectPartyTab";
import DatePicker from "react-datepicker";
import { useCreatePartyPlanMutation } from "@/redux/features/partyPlan/partyPlanApi";

interface FormData {
  childName: string;
  childAge: number;
  guestCount: number;
  budget: number;
  date: Date | null;
  location: string;
  selectedTheme: string;
  selectedActivities: string[]; 
}

interface PartyPlanData {
  person_name: string;
  person_age: number;
  budget: number;
  num_guests: number;
  party_date: string;
  location: string;
  party_details: {
    theme: string;
    favorite_activities: string[];
  };
  num_product: number;
}

export default function PartyGenerator() {
  const [activeStep, setActiveStep] = useState("Basis Info");
  const [partyPlanData, setPartyPlanData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createPartyPlan] = useCreatePartyPlanMutation();
  const [formData, setFormData] = useState<FormData>({
    childName: "",
    childAge: 0,
    guestCount: 0,
    budget: 0,
    date: null,
    location: "",
    selectedTheme: "",
    selectedActivities: [],
  });
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const steps = [
    {
      id: "Basis Info",
      title: "Basis Info",
      icon: 1, 
    },
    {
      id: "Party Details",
      title: "Party Details",

      icon: 2,
    },
    {
      id: "Preferences",
      title: "Preferences",

      icon: 3,
    },
    {
      id: "Your Perfect Party",
      title: "Your Perfect Party",

      icon: 4,
    },
  ];

  const getStepIndex = (stepId: string) => {
    return steps.findIndex((step) => step.id === stepId);
  };

  const isLineActive = (fromIndex: number) => {
    const currentIndex = getStepIndex(activeStep);
    return currentIndex > fromIndex;
  };
  
  const stepRequiredFields: Record<string, string[]> = {
    "Basis Info": ["childName", "childAge"],
    "Party Details": ["guestCount", "budget", "date", "location"],
    Preferences: ["selectedTheme", "selectedActivities"],
  };

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(
      (prev) =>
        prev.includes(activityId)
          ? prev.filter((id) => id !== activityId) // remove if already selected
          : [...prev, activityId], // add if not selected
    );
  };
  const formatDateForAPI = (date: Date): string => {
    if (!date) return "";
    
    const day = date.getDate();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  const prepareAPIData = (): PartyPlanData => {
    return {
      person_name: formData.childName,
      person_age: formData.childAge,
      budget: formData.budget,
      num_guests: formData.guestCount,
      party_date: formatDateForAPI(formData.date!),
      location: formData.location,
      party_details: {
        theme: selectedTheme,
        favorite_activities: selectedActivities,
      },
      num_product: 3, // Default to 3 as shown in your example
    };
  };

  const handleAPICall = async () => {
    setIsLoading(true);
    try {
      const apiData = prepareAPIData();
      console.log("Sending API data:", apiData);
      
      const response = await createPartyPlan(apiData).unwrap();
      console.log("API Response:", response);
      
      setPartyPlanData(response);
      
      // Move to next step after successful API call
      const currentIndex = getStepIndex(activeStep);
      const nextIndex = currentIndex + 1;
      if (nextIndex < steps.length) {
        setActiveStep(steps[nextIndex].id);
      }
      
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        html: "Failed to generate party plan. Please try again.",
        confirmButtonColor: "#3085d6",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-html-container",
          confirmButton: "swal2-confirm",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleNext = () => {
    const currentStepFields = stepRequiredFields[activeStep] || [];
    if (activeStep !== "Preferences") {
      for (const field of currentStepFields) {
        if (
          (formData as any)[field] === "" ||
          (formData as any)[field] == null
        ) {
          const fieldName = field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          Swal.fire({
            icon: "warning",
            title: "Required Field",
            html: `Please fill in <strong>${fieldName}</strong> before continuing.`,
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
    }
    if (activeStep === "Preferences") {
      if (!selectedTheme || selectedActivities.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Required Field",
          html: `Please select a <strong>Theme</strong> and at least one <strong>Activity</strong> before continuing.`,
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
      handleAPICall();
      return;
    }
    const currentIndex = getStepIndex(activeStep);
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setActiveStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const currentIndex = getStepIndex(activeStep);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setActiveStep(steps[prevIndex].id);
    }
  };

  const ageOptions = [
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20
  ];

  const themes = [
    {
      id: "unicorns",
      name: "🦄 Unicorns",
    },
    { id: "princess", name: "🏰 Princess" },
    { id: "space", name: "🚀 Space" },
    {
      id: "superheroes",
      name: "🦸 Superheroes",
    },
    {
      id: "art-party",
      name: "🎨 Art Party",
    },
    { id: "animals", name: "🐾 Animals" },
    { id: "pirates", name: "🏴‍☠️ Pirates" },
    {
      id: "fairy-tale",
      name: "🧚 Fairy Tale",
    },
    { id: "other-theme", name: "Other" },
  ];

  const activities = [
    {
      id: "craft",
      name: "Craft activities ✂️",
    },
    {
      id: "outdoor",
      name: "Outdoor games 🌳",
    },
    {
      id: "treasure",
      name: "Treasure hunt 🗺️",
    },
    {
      id: "show",
      name: "Show or animation 🎭",
    },
    {
      id: "cooking",
      name: "Cooking workshop 🍪",
    },
    { id: "other-activity", name: "Other" },
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case "Basis Info":
        return (
          <div>
            <div className="mx-auto max-w-4xl">
              <h2 className="text-center text-3xl font-bold text-[#050505]">
                Step 1: Tell us about your party! 🎉
              </h2>
              <div className="mt-10 w-full rounded-xl bg-white p-8 py-10 drop-shadow">
                <h1 className="font-fredoka mb-8 text-2xl font-semibold text-gray-900">
                  Tell us about your child
                </h1>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="childName"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Child's Name
                    </label>
                    <input
                      type="text"
                      id="childName"
                      value={formData.childName}
                      onChange={(e) => {
                        const onlyText = e.target.value.replace(/[0-9]/g, ""); 
                        setFormData({ ...formData, childName: onlyText });
                      }}
                      required
                      placeholder="Child's Name"
                      className="w-full rounded-xl border border-[#C9C9C9] px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="childAge"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Child's Age
                    </label>
                    <div className="relative">
                      <select
                        id="childAge"
                        value={formData.childAge}
                        onChange={(e) =>
                          setFormData({ ...formData, childAge: parseInt(e.target.value) })
                        }
                        required
                        className="w-full cursor-pointer appearance-none rounded-xl border border-[#C9C9C9] bg-white px-4 py-3 transition-all duration-200 outline-none focus:border-transparent focus:ring-2"
                      >
                        <option value="" disabled>
                          Select age
                        </option>
                        {ageOptions.map((age) => (
                          <option key={age} value={age}>
                            {age}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <FiChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="cursor-pointer rounded-md bg-[#223B7D] px-6 py-3 text-white transition-all duration-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "Party Details":
        return (
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold text-[#050505] md:text-3xl">
              Step 2: A few more details! ✨
            </h2>
            <div className="mt-10 w-full max-w-4xl rounded-xl bg-white p-8 py-10 shadow-lg">
              <h1 className="font-fredoka mb-8 text-2xl font-semibold text-gray-900">
                Party Details
              </h1>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <select
                      value={formData.guestCount}
                      onChange={(e) =>
                        setFormData({ ...formData, guestCount: parseInt(e.target.value) })
                      }
                      className="w-full cursor-pointer appearance-none rounded-xl border border-[#C9C9C9] bg-white px-4 py-3 text-gray-700"
                    >
                      <option value="">Select guest count</option>
                      <option value="5">1-10 guests</option>
                      <option value="20">11-25 guests</option>
                      <option value="40">26-50 guests</option>
                      <option value="100">51-100 guests</option>
                      <option value="300">100+ guests</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Budget Range
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: parseInt(e.target.value) })
                      }
                      className="w-full cursor-pointer appearance-none rounded-xl border border-[#C9C9C9] bg-white px-4 py-3 text-gray-700"
                    >
                      <option value="">Select budget</option>
                      <option value="300">Under $500</option>
                      <option value="700">$500 - $1,000</option>
                      <option value="1500">$1,000 - $2,500</option>
                      <option value="4000">$2,500 - $5,000</option>
                      <option value="7000">$5,000+</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  </div>
                </div>
                <div className="w-full">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Party Date
                  </label>
                  <DatePicker
                    selected={formData.date}
                    onChange={(date: Date | null) =>
                      setFormData({ ...formData, date })
                    }
                    placeholderText="dd/mm/yyyy"
                    className="w-full rounded-xl border border-[#C9C9C9] bg-white px-4 py-3 text-gray-700"
                    wrapperClassName="w-full" // ✅ ensures outer wrapper div is full width
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full cursor-pointer appearance-none rounded-xl border border-[#C9C9C9] bg-white px-4 py-3 text-gray-700"
                    >
                      <option value="">Select location</option>
                      <option value="home">At Home</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="venue">Event Venue</option>
                      <option value="park">Park/Outdoor</option>
                      <option value="hotel">Hotel</option>
                      <option value="other">Other</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
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
          </div>
        );

      case "Preferences":
        return (
          <div className="mx-auto max-w-4xl">
            <h2 className="font-fredoka text-center text-3xl font-semibold text-[#050505]">
              Step 3: A few more details! ✨
            </h2>
            <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
              <div className="mb-12">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Party Details
                </h2>
                <p className="mb-8 text-gray-600">
                  Choose a theme or let AI surprise you!
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {themes.map((theme) => {
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                          selectedTheme === theme.id
                            ? "border-[#223B7D] bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        } `}
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <span className="font-medium text-gray-800">
                            {theme.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mb-12">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Favorite Activities
                </h2>
                <p className="mb-8 text-gray-600">
                  Would you like to add one or more specific activities?
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {activities.map((activity) => {
                    const isSelected = selectedActivities.includes(activity.id);
                    return (
                      <button
                        key={activity.id}
                        onClick={() => handleActivityToggle(activity.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                          isSelected
                            ? "border-[#223B7D] bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        } `}
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <span className="font-medium text-gray-800">
                            {activity.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <button
                  onClick={handleBack}
                  className="cursor-pointer rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!selectedTheme || selectedActivities.length === 0 || isLoading}
                  className={`flex items-center space-x-2 rounded-lg px-8 py-3 font-medium transition-all duration-200 ${
                    selectedTheme && selectedActivities.length > 0 && !isLoading
                      ? "cursor-pointer bg-[#223B7D] text-white hover:bg-[#1a2f66] hover:shadow-lg"
                      : "cursor-not-allowed bg-gray-400 text-gray-200"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      ✨ Generate My Party!
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case "Your Perfect Party":
        return (
          <div>
            <YourPerfectPartyTab 
              setActiveStep={setActiveStep} 
              partyPlanData={partyPlanData}
            />
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div className=" ">
      <MyHeader
        title=" AI Party Generator"
        subtitle=" Tell us about your party, and our AI will create the perfect plan
              in minutes!"
        className="text-3xl sm:text-5xl md:text-6xl"
      ></MyHeader>
      <div className="relative mt-1">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url(${allBgImg})` }}
        ></div>
        <div className="relative z-10 px-2">
          <div className="mb-8 lg:mb-12"></div>
          <div className="mx-auto -mt-20 max-w-[1400px] rounded-2xl bg-transparent pt-10 drop-shadow-sm">
            <div className="mb-2 flex justify-center">
              <div className="flex w-full max-w-6xl items-center px-2">
                {steps.map((step, index) => {
                  const currentIndex = getStepIndex(activeStep);
                  const stepIndex = getStepIndex(step.id);
                  const isCompleted = stepIndex < currentIndex;
                  const isActive = stepIndex === currentIndex;

                  return (
                    <React.Fragment key={step.id}>
                      <div className="relative flex h-[130px] flex-1 flex-col items-center">
                        {index < steps.length - 1 && (
                          <div className="absolute top-6 left-1/2 z-0 h-0.5 w-full">
                            <div
                              className={`h-full w-full ${
                                isLineActive(index)
                                  ? "bg-[#223B7D]" //this line for  active line color
                                  : "bg-gray-300"
                              }`}
                            ></div>
                          </div>
                        )}
                        <div
                          onClick={() => {
                            const targetIndex = getStepIndex(step.id);
                            const currentIndex = getStepIndex(activeStep);
                            if (targetIndex > currentIndex) {
                              const currentStepFields =
                                stepRequiredFields[activeStep] || [];
                              for (const field of currentStepFields) {
                                if (
                                  (formData as any)[field] === "" ||
                                  (formData as any)[field] == null ||
                                  (Array.isArray((formData as any)[field]) &&
                                    (formData as any)[field].length === 0)
                                ) {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "Required Field",
                                    html: `Please fill in <strong>${activeStep}</strong> before continuing.`,
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
                            }

                            setActiveStep(step.id); 
                          }}
                          className={`relative z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${
                            isCompleted
                              ? "bg-[#223B7D] text-white"
                              : isActive
                                ? "bg-[#223B7D] text-white"
                                : "bg-[#C9C9C9] text-white"
                          }`}
                        >
                          <h2 className="font-fredoka text-xl font-bold">
                            {step.icon}
                          </h2>
                        </div>
                        <div className="mt-2 text-center">
                          <div
                            className={`text-sm font-medium lg:text-base ${
                              isActive || isCompleted
                                ? "text-black"
                                : "text-gray-800"
                            }`}
                          >
                            <h2 className="font-fredoka text-base break-words whitespace-normal md:text-xl">
                              {" "}
                              {step.title} <br />{" "}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="mb-4 p-6 lg:p-8">{renderStepContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
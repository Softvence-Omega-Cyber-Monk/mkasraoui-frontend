"use client";
import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  useGetProviderByIdQuery,
  useUpdateProviderProfileMutation,
} from "@/redux/features/property/propertyApi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { ArrowLeft } from "lucide-react";
import PageLoader from "../Shared/PageLoader";
import toast from "react-hot-toast";

const IndividualProvider: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user } = useGetMeQuery();
  const { data: provider, isLoading } = useGetProviderByIdQuery(id!, {
    skip: !id,
  });
  const [updateProvider, { isLoading: updating }] =
    useUpdateProviderProfileMutation();

  const [formState, setFormState] = useState({
    bussinessName: "",
    email: "",
    contactName: "",
    phone: "",
    description: "",
    serviceArea: "",
    price: "",
    website: "",
    instagram: "",
  });

  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (provider) {
      setFormState({
        bussinessName: provider.bussinessName || "",
        email: provider.email || "",
        contactName: provider.contactName || "",
        phone: provider.phone || "",
        description: provider.description || "",
        serviceArea: provider.serviceArea || "",
        // price: provider.price || "",
        price: provider.price?.toString() || "",
        website: provider.website || "",
        instagram: provider.instagram || "",
      });
    }
  }, [provider]);

  if (provider && user?.id !== provider.userId) {
    return <Navigate to="/dashboard/providers" />;
  }

  if (isLoading)
    return (
      <div className="flex justify-center py-20 text-gray-500">
        <PageLoader />
      </div>
    );

  if (!provider)
    return (
      <div className="flex justify-center py-20 text-gray-500">
        No provider found
      </div>
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormState({ ...formState, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFiles(e.target.files);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const payload = {
      ...formState,
      price: Number(formState.price),
      serviceCategory: provider.serviceCategory,
      latitude: provider.latitude,
      longitude: provider.longitude,
      removeImages: [],
    };

    formData.append("data", JSON.stringify(payload));

    if (files) {
      Array.from(files).forEach((file) => formData.append("files", file));
    }

    try {
      await updateProvider(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="mx-auto min-h-screen bg-gray-50">
      {/* Back Button */}
      <Link
        to="/dashboard/providers"
        className="mb-6 flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={20} /> Back to Providers
      </Link>

      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Edit Provider Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 space-y-4 md:grid-cols-2 md:gap-4 md:space-y-0">
            <div>
              <label className="block font-medium text-gray-700">
                Business Name
                <input
                  type="text"
                  name="bussinessName"
                  value={formState.bussinessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Contact Name
                <input
                  type="text"
                  name="contactName"
                  value={formState.contactName}
                  onChange={handleChange}
                  placeholder="Enter contact name"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Phone
                <input
                  type="text"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                Service Area
                <input
                  type="text"
                  name="serviceArea"
                  value={formState.serviceArea}
                  onChange={handleChange}
                  placeholder="Enter service area"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Price
                <input
                  type="text"
                  name="price"
                  value={formState.price}
                  onChange={handleChange}
                  placeholder="Enter price range"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                Website
                <input
                  type="text"
                  name="website"
                  value={formState.website}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Instagram
                <input
                  type="text"
                  name="instagram"
                  value={formState.instagram}
                  onChange={handleChange}
                  placeholder="Enter Instagram URL"
                  className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Description
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows={4}
                className="mt-1 block w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-semibold text-gray-800">
              Portfolio Images
            </label>
            <div
              className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition-colors hover:border-[#223B7D] hover:bg-gray-100"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <p className="mb-2 text-sm text-gray-500">
                Drag & drop your files here or click to upload
              </p>
              <input
                id="fileInput"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-400">
                Accepted formats: JPG, PNG, PDF
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full cursor-pointer rounded-xl bg-[#223B7D] py-3 font-semibold text-white transition hover:bg-[#021750]"
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Portfolio Display */}
      {provider.portfolioImages && provider.portfolioImages.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Portfolio Images
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {provider.portfolioImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`portfolio-${i}`}
                className="h-40 w-full rounded-lg object-cover shadow-sm"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualProvider;

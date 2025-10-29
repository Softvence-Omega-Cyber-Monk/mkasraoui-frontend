// src/pages/AdminProductTable.tsx
import React, { useState, type ChangeEvent } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/redux/features/product/productApi";
import type { Product } from "@/redux/types/product.type";
import toast from "react-hot-toast";
import PageLoader from "@/components/Shared/PageLoader";
import { ChevronDown, Plus, Search } from "lucide-react";
import Title from "@/components/Shared/Title";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";

interface FormDataType {
  title: string;
  description: string;
  product_type: string;
  age_range: string;
  price: string;
  included: string;
  tutorial: string;
  activities: string;
  files: File[];
  existingFiles: string[];
}

interface FormErrorType {
  [key: string]: string;
}

const AdminProductTable: React.FC = () => {
  const { data, isLoading, isFetching } = useGetProductsQuery();

  const products: Product[] = [
    ...(data?.data?.diyBoxes ?? []),
    ...(data?.data?.gifts ?? []),
  ];

  const [deleteProduct] = useDeleteProductMutation();
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  /* Filter */

  /* ---------------- Filter Section ---------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [ageRange, setAgeRange] = useState("");

  // Extract available filter options dynamically
  const availableAgeRanges = Array.from(
    new Set(products.map((p) => p.age_range).filter(Boolean)),
  );

  // ✅ Filtered products based on search & age range
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.activities?.some((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesAge =
      !ageRange || p.age_range.toLowerCase() === ageRange.toLowerCase();

    return matchesSearch && matchesAge;
  });

  // Reset to first page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, ageRange]);

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    product_type: "",
    age_range: "",
    price: "",
    included: "",
    tutorial: "",
    activities: "",
    files: [],
    existingFiles: [],
  });

  const [errors, setErrors] = useState<FormErrorType>({});

  // Pagination
  // Pagination (after filtering)
  const [page, setPage] = useState(1);
  const productsPerPage = 10;
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage,
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      product_type: "",
      age_range: "",
      price: "",
      included: "",
      tutorial: "",
      activities: "",
      files: [],
      existingFiles: [],
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      product_type: product.product_type,
      age_range: product.age_range,
      price: product.price.toString(),
      included: product.included.join(", "),
      tutorial: product.tutorial || "",
      activities:
        product.activities
          ?.map((a) => `${a.title}::${a.description}`)
          .join("|") || "",
      files: [],
      existingFiles: product.imges ?? [],
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProduct(confirmDelete.id).unwrap();
      toast.success("Product deleted successfully");
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles].slice(0, 5),
    }));

    e.target.value = "";
  };

  const validateForm = () => {
    const newErrors: FormErrorType = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.product_type.trim())
      newErrors.product_type = "Product type is required";
    if (!formData.age_range.trim())
      newErrors.age_range = "Age range is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.included.trim())
      newErrors.included = "Included items are required";
    // Tutorial link: required only when adding a new product
    if (!editingProduct && !formData.tutorial.trim()) {
      newErrors.tutorial = "Tutorial link is required";
    }
    // Only require activities if adding a new product
    // if (!editingProduct && !formData.activities.trim())
    //   newErrors.activities = "Activity field is required";

    // Activities: required only when adding a new product
    if (!editingProduct) {
      if (!formData.activities.trim()) {
        newErrors.activities = "Activity field is required";
      } else {
        // Validate format: title::description (one or more, separated by | is optional)
        const activityItems = formData.activities
          .split("|")
          .map((item) => item.trim());
        const isValid = activityItems.every((item) => /^.+::.+$/.test(item));
        if (!isValid) {
          newErrors.activities =
            "Activities must be in the format 'title::description'";
        }
      }
    }

    if (formData.files.length === 0 && formData.existingFiles.length === 0)
      newErrors.files = "Please upload at least one photo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const dataToSend = new FormData();
      const payload = {
        title: formData.title,
        description: formData.description,
        product_type: formData.product_type,
        age_range: formData.age_range,
        price: parseFloat(formData.price),
        included: formData.included.split(",").map((i) => i.trim()),
        tutorial: formData.tutorial || null,
        activities: formData.activities
          ? formData.activities.split("|").map((a) => {
              const [title, description] = a.split("::");
              return { title: title.trim(), description: description.trim() };
            })
          : [],
        // Include existing images as array of URLs
        imges: formData.existingFiles,
      };

      dataToSend.append("data", JSON.stringify(payload));

      // Append new files
      formData.files.forEach((file) => dataToSend.append("files", file));

      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          data: dataToSend,
        }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await addProduct(dataToSend).unwrap();
        toast.success("Product added successfully");
      }

      // Reset modal
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        product_type: "",
        age_range: "",
        price: "",
        included: "",
        tutorial: "",
        activities: "",
        files: [],
        existingFiles: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting product");
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title title="Products" />
        <button
          onClick={openAddModal}
          className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
        >
          <Plus className="h-5 w-5" /> Add Product
        </button>
      </div>
      {/* Filter */}
      {/* Filter Section */}
      {/* ✅ Filter Section with Modern Design */}
      <div className="mb-8">
        <div className="mx-auto flex flex-col items-center space-y-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative w-full flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, activities, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            />
          </div>

          {/* Age Range Filter */}
          <div className="relative w-full md:w-[180px]">
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            >
              <option value="">All Ages</option>
              {availableAgeRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Age Range
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-sm text-gray-500"
                  >
                    <PageLoader />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 pr-3 text-sm font-semibold whitespace-nowrap text-gray-900">
                      {product.title.split(" ").slice(0, 3).join(" ")}
                    </td>
                    <td className="py-3 text-sm whitespace-nowrap text-gray-600">
                      {product.description.split(" ").slice(0, 5).join(" ")}
                      {product.description.split(" ").length > 5 && " ..."}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {product.product_type}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {product.age_range}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      €{product.price}
                    </td>
                    <td className="flex justify-center space-x-2 py-3">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex cursor-pointer items-center justify-center rounded-md bg-yellow-500 p-2 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      >
                        <FaRegEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(product)}
                        className="flex cursor-pointer items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewProduct(product)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0F1F4C] px-3 py-2 text-sm font-medium text-white hover:bg-[#02133f] focus:ring-2 focus:outline-none"
                      >
                        <GrView className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="mt-6 flex items-center justify-between px-4 py-3">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">{paginatedProducts.length}</span> of{" "}
              <span className="font-medium">{total}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px]">
          <div className="relative w-full max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
            <h3 className="mb-6 text-2xl font-semibold text-gray-900">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>

            {/* Form Fields */}
            <div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-medium">Title</label>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Product Type */}
                <div className="space-y-1">
                  <label className="font-medium">Select Type</label>
                  <select
                    value={formData.product_type}
                    onChange={(e) =>
                      setFormData({ ...formData, product_type: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                  >
                    <option value="">Select Product Type</option>
                    <option value="DIY_BOX">DIY Box</option>
                  </select>
                  {errors.product_type && (
                    <p className="text-xs text-red-500">
                      {errors.product_type}
                    </p>
                  )}
                </div>

                {/* Age Range */}
                <div className="space-y-1">
                  <label className="font-medium">Age Range</label>
                  <input
                    type="text"
                    placeholder="Age Range(0-100)"
                    value={formData.age_range}
                    onChange={(e) =>
                      setFormData({ ...formData, age_range: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                  />
                  {errors.age_range && (
                    <p className="text-xs text-red-500">{errors.age_range}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="font-medium">Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500">{errors.price}</p>
                  )}
                </div>

                {/* Included */}
                <div className="space-y-1">
                  <label className="font-medium">Include Items</label>
                  <input
                    type="text"
                    placeholder="Included Items (comma separated)"
                    value={formData.included}
                    onChange={(e) =>
                      setFormData({ ...formData, included: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                  />
                  {errors.included && (
                    <p className="text-xs text-red-500">{errors.included}</p>
                  )}
                </div>

                {/* Tutorial */}
                <div className="space-y-1">
                  <label className="font-medium">Provide Tutorial Link</label>
                  <input
                    type="text"
                    placeholder="Tutorial Link"
                    value={formData.tutorial}
                    onChange={(e) =>
                      setFormData({ ...formData, tutorial: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                  />
                  {errors.tutorial && (
                    <p className="text-xs text-red-500">{errors.tutorial}</p>
                  )}
                </div>
              </div>

              {/* Activities */}
              <div className="mt-2 space-y-1">
                <label className="font-medium">Activity</label>
                <input
                  type="text"
                  placeholder="Activities (title::description | ...)"
                  value={formData.activities}
                  onChange={(e) =>
                    setFormData({ ...formData, activities: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                />
                {errors.activities && (
                  <p className="text-xs text-red-500">{errors.activities}</p>
                )}
              </div>

              {/* Description */}
              <div className="mt-2 space-y-1">
                <label className="font-medium">Description</label>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-22 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Upload Photos */}
              <div className="mt-3 mb-2 space-y-2">
                <label className="font-medium">Upload Photos</label>
                <div
                  className="relative flex h-25 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:border-blue-400 hover:bg-blue-50"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 hidden"
                  />
                  <p className="text-gray-500">
                    Drag & drop photos here or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    You can upload multiple images (max 5)
                  </p>
                </div>
                {errors.files && (
                  <p className="text-xs text-red-500">{errors.files}</p>
                )}

                <div className="mt-3 grid grid-cols-1 gap-2">
                  {/* Existing uploaded images */}
                  {formData.existingFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {formData.existingFiles.map((url, idx) => (
                        <div
                          key={`exist-${idx}`}
                          className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img
                            src={url}
                            alt={`existing-img-${idx}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                existingFiles: prev.existingFiles.filter(
                                  (_, i) => i !== idx,
                                ),
                              }))
                            }
                            className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Newly selected images (before upload) */}
                  {formData.files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {Array.from(formData.files).map((file, idx) => (
                        <div
                          key={`new-${idx}`}
                          className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`new-img-${idx}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                files: prev.files.filter((_, i) => i !== idx),
                              }))
                            }
                            className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-xl bg-gray-200 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-6 py-2 text-base font-medium text-white"
              >
                {editingProduct ? "Update" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Product Details
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Title:</span>{" "}
                {viewProduct.title}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {viewProduct.description}
              </p>
              <p>
                <span className="font-semibold">Type:</span>{" "}
                {viewProduct.product_type}
              </p>
              <p>
                <span className="font-semibold">Age Range:</span>{" "}
                {viewProduct.age_range}
              </p>
              <p>
                <span className="font-semibold">Price:</span> $
                {viewProduct.price}
              </p>
              <p>
                <span className="font-semibold">Included:</span>{" "}
                {viewProduct.included.join(", ")}
              </p>
              {viewProduct.tutorial && (
                <p>
                  <span className="font-semibold">Tutorial:</span>{" "}
                  {viewProduct.tutorial}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewProduct(null)}
                className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{confirmDelete.title}</span>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductTable;

// // src/pages/AdminProductTable.tsx
// import React, { useState, type ChangeEvent } from "react";
// import {
//   useGetProductsQuery,
//   useDeleteProductMutation,
//   useAddProductMutation,
//   useUpdateProductMutation,
// } from "@/redux/features/product/productApi";
// import type { Product } from "@/redux/types/product.type";
// import toast from "react-hot-toast";
// import PageLoader from "@/components/Shared/PageLoader";
// import { Plus } from "lucide-react";
// import Title from "@/components/Shared/Title";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";

// interface FormDataType {
//   title: string;
//   description: string;
//   product_type: string;
//   age_range: string;
//   price: string;
//   included: string;
//   tutorial: string;
//   activities: string;
//   files: File[];
//   existingFiles: string[];
// }

// interface FormErrorType {
//   [key: string]: string;
// }

// const AdminProductTable: React.FC = () => {
//   const { data, isLoading, isFetching } = useGetProductsQuery();

//   const products: Product[] = [
//     ...(data?.data?.diyBoxes ?? []),
//     ...(data?.data?.gifts ?? []),
//   ];

//   const [deleteProduct] = useDeleteProductMutation();
//   const [addProduct] = useAddProductMutation();
//   const [updateProduct] = useUpdateProductMutation();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [viewProduct, setViewProduct] = useState<Product | null>(null);
//   const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

//   const [formData, setFormData] = useState<FormDataType>({
//     title: "",
//     description: "",
//     product_type: "",
//     age_range: "",
//     price: "",
//     included: "",
//     tutorial: "",
//     activities: "",
//     files: [],
//     existingFiles: [],
//   });

//   const [errors, setErrors] = useState<FormErrorType>({});

//   // Pagination
//   const [page, setPage] = useState(1);
//   const productsPerPage = 10;
//   const total = products.length;
//   const totalPages = Math.ceil(total / productsPerPage);
//   const paginatedProducts = products.slice(
//     (page - 1) * productsPerPage,
//     page * productsPerPage,
//   );

//   const openAddModal = () => {
//     setEditingProduct(null);
//     setFormData({
//       title: "",
//       description: "",
//       product_type: "",
//       age_range: "",
//       price: "",
//       included: "",
//       tutorial: "",
//       activities: "",
//       files: [],
//       existingFiles: [],
//     });
//     setErrors({});
//     setIsModalOpen(true);
//   };

//   const openEditModal = (product: Product) => {
//     setEditingProduct(product);
//     setFormData({
//       title: product.title,
//       description: product.description,
//       product_type: product.product_type,
//       age_range: product.age_range,
//       price: product.price.toString(),
//       included: product.included.join(", "),
//       tutorial: product.tutorial || "",
//       activities:
//         product.activities
//           ?.map((a) => `${a.title}::${a.description}`)
//           .join("|") || "",
//       files: [],
//       existingFiles: product.imges ?? [],
//     });
//     setErrors({});
//     setIsModalOpen(true);
//   };

//   const handleDelete = async () => {
//     if (!confirmDelete) return;
//     try {
//       await deleteProduct(confirmDelete.id).unwrap();
//       toast.success("Product deleted successfully");
//       setConfirmDelete(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete product");
//     }
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     if (!e.target.files) return;

//     const selectedFiles = Array.from(e.target.files);

//     setFormData((prev) => ({
//       ...prev,
//       files: [...prev.files, ...selectedFiles].slice(0, 5),
//     }));

//     e.target.value = "";
//   };

//   const validateForm = () => {
//     const newErrors: FormErrorType = {};

//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     if (!formData.description.trim())
//       newErrors.description = "Description is required";
//     if (!formData.product_type.trim())
//       newErrors.product_type = "Product type is required";
//     if (!formData.age_range.trim())
//       newErrors.age_range = "Age range is required";
//     if (!formData.price.trim()) newErrors.price = "Price is required";
//     if (!formData.included.trim())
//       newErrors.included = "Included items are required";
//     // Tutorial link: required only when adding a new product
//     if (!editingProduct && !formData.tutorial.trim()) {
//       newErrors.tutorial = "Tutorial link is required";
//     }
//     // Only require activities if adding a new product
//     // if (!editingProduct && !formData.activities.trim())
//     //   newErrors.activities = "Activity field is required";

//     // Activities: required only when adding a new product
//     if (!editingProduct) {
//       if (!formData.activities.trim()) {
//         newErrors.activities = "Activity field is required";
//       } else {
//         // Validate format: title::description (one or more, separated by | is optional)
//         const activityItems = formData.activities
//           .split("|")
//           .map((item) => item.trim());
//         const isValid = activityItems.every((item) => /^.+::.+$/.test(item));
//         if (!isValid) {
//           newErrors.activities =
//             "Activities must be in the format 'title::description'";
//         }
//       }
//     }

//     if (formData.files.length === 0 && formData.existingFiles.length === 0)
//       newErrors.files = "Please upload at least one photo";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     try {
//       const dataToSend = new FormData();
//       const payload = {
//         title: formData.title,
//         description: formData.description,
//         product_type: formData.product_type,
//         age_range: formData.age_range,
//         price: parseFloat(formData.price),
//         included: formData.included.split(",").map((i) => i.trim()),
//         tutorial: formData.tutorial || null,
//         activities: formData.activities
//           ? formData.activities.split("|").map((a) => {
//               const [title, description] = a.split("::");
//               return { title: title.trim(), description: description.trim() };
//             })
//           : [],
//         // Include existing images as array of URLs
//         imges: formData.existingFiles,
//       };

//       dataToSend.append("data", JSON.stringify(payload));

//       // Append new files
//       formData.files.forEach((file) => dataToSend.append("files", file));

//       if (editingProduct) {
//         await updateProduct({
//           id: editingProduct.id,
//           data: dataToSend,
//         }).unwrap();
//         toast.success("Product updated successfully");
//       } else {
//         await addProduct(dataToSend).unwrap();
//         toast.success("Product added successfully");
//       }

//       // Reset modal
//       setIsModalOpen(false);
//       setFormData({
//         title: "",
//         description: "",
//         product_type: "",
//         age_range: "",
//         price: "",
//         included: "",
//         tutorial: "",
//         activities: "",
//         files: [],
//         existingFiles: [],
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("Error submitting product");
//     }
//   };

//   return (
//     <div className="">
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <Title title="Products" />
//         <button
//           onClick={openAddModal}
//           className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
//         >
//           <Plus className="h-5 w-5" /> Add Product
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[800px]">
//             <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
//                   Title
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
//                   Description
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
//                   Type
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
//                   Age Range
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
//                   Price
//                 </th>
//                 <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading || isFetching ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="p-6 text-center text-sm text-gray-500"
//                   >
//                     <PageLoader />
//                   </td>
//                 </tr>
//               ) : products.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     className="p-6 text-center text-sm text-gray-600"
//                   >
//                     No products found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedProducts.map((product) => (
//                   <tr
//                     key={product.id}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="px-3 pr-3 text-sm font-semibold whitespace-nowrap text-gray-900">
//                       {product.title.split(" ").slice(0, 3).join(" ")}
//                     </td>
//                     <td className="py-3 text-sm whitespace-nowrap text-gray-600">
//                       {product.description.split(" ").slice(0, 5).join(" ")}
//                       {product.description.split(" ").length > 5 && " ..."}
//                     </td>
//                     <td className="py-3 text-sm text-gray-600">
//                       {product.product_type}
//                     </td>
//                     <td className="py-3 text-sm text-gray-600">
//                       {product.age_range}
//                     </td>
//                     <td className="py-3 text-sm text-gray-600">
//                       €{product.price}
//                     </td>
//                     <td className="flex justify-center space-x-2 py-3">
//                       <button
//                         onClick={() => openEditModal(product)}
//                         className="flex cursor-pointer items-center justify-center rounded-md bg-yellow-500 p-2 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
//                       >
//                         <FaRegEdit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => setConfirmDelete(product)}
//                         className="flex cursor-pointer items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
//                       >
//                         <MdDelete className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => setViewProduct(product)}
//                         className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0F1F4C] px-3 py-2 text-sm font-medium text-white hover:bg-[#02133f] focus:ring-2 focus:outline-none"
//                       >
//                         <GrView className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {products.length > 0 && (
//           <div className="mt-6 flex items-center justify-between px-4 py-3">
//             <div className="text-sm text-gray-600">
//               Showing{" "}
//               <span className="font-medium">{paginatedProducts.length}</span> of{" "}
//               <span className="font-medium">{total}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page <= 1}
//                 className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
//                 {page} / {totalPages}
//               </div>
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page >= totalPages}
//                 className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px]">
//           <div className="relative w-full max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
//             <h3 className="mb-6 text-2xl font-semibold text-gray-900">
//               {editingProduct ? "Edit Product" : "Add Product"}
//             </h3>

//             {/* Form Fields */}
//             <div>
//               <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                 {/* Title */}
//                 <div className="space-y-1">
//                   <label className="font-medium">Title</label>
//                   <input
//                     type="text"
//                     placeholder="Title"
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                   />
//                   {errors.title && (
//                     <p className="text-xs text-red-500">{errors.title}</p>
//                   )}
//                 </div>

//                 {/* Product Type */}
//                 <div className="space-y-1">
//                   <label className="font-medium">Select Type</label>
//                   <select
//                     value={formData.product_type}
//                     onChange={(e) =>
//                       setFormData({ ...formData, product_type: e.target.value })
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                   >
//                     <option value="">Select Product Type</option>
//                     <option value="DIY_BOX">DIY Box</option>
//                   </select>
//                   {errors.product_type && (
//                     <p className="text-xs text-red-500">
//                       {errors.product_type}
//                     </p>
//                   )}
//                 </div>

//                 {/* Age Range */}
//                 <div className="space-y-1">
//                   <label className="font-medium">Age Range</label>
//                   <input
//                     type="text"
//                     placeholder="Age Range(0-100)"
//                     value={formData.age_range}
//                     onChange={(e) =>
//                       setFormData({ ...formData, age_range: e.target.value })
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                   />
//                   {errors.age_range && (
//                     <p className="text-xs text-red-500">{errors.age_range}</p>
//                   )}
//                 </div>

//                 {/* Price */}
//                 <div className="space-y-1">
//                   <label className="font-medium">Price</label>
//                   <input
//                     type="number"
//                     placeholder="Price"
//                     value={formData.price}
//                     onChange={(e) =>
//                       setFormData({ ...formData, price: e.target.value })
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                   />
//                   {errors.price && (
//                     <p className="text-xs text-red-500">{errors.price}</p>
//                   )}
//                 </div>

//                 {/* Included */}
//                 <div className="space-y-1">
//                   <label className="font-medium">Include Items</label>
//                   <input
//                     type="text"
//                     placeholder="Included Items (comma separated)"
//                     value={formData.included}
//                     onChange={(e) =>
//                       setFormData({ ...formData, included: e.target.value })
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                   />
//                   {errors.included && (
//                     <p className="text-xs text-red-500">{errors.included}</p>
//                   )}
//                 </div>

//                 {/* Tutorial */}
//                 <div className="space-y-1">
//                   <label className="font-medium">Provide Tutorial Link</label>
//                   <input
//                     type="text"
//                     placeholder="Tutorial Link"
//                     value={formData.tutorial}
//                     onChange={(e) =>
//                       setFormData({ ...formData, tutorial: e.target.value })
//                     }
//                     className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                   />
//                   {errors.tutorial && (
//                     <p className="text-xs text-red-500">{errors.tutorial}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Activities */}
//               <div className="mt-2 space-y-1">
//                 <label className="font-medium">Activity</label>
//                 <input
//                   type="text"
//                   placeholder="Activities (title::description | ...)"
//                   value={formData.activities}
//                   onChange={(e) =>
//                     setFormData({ ...formData, activities: e.target.value })
//                   }
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                 />
//                 {errors.activities && (
//                   <p className="text-xs text-red-500">{errors.activities}</p>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="mt-2 space-y-1">
//                 <label className="font-medium">Description</label>
//                 <textarea
//                   placeholder="Description"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   className="h-22 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100"
//                   rows={4}
//                 />
//                 {errors.description && (
//                   <p className="text-xs text-red-500">{errors.description}</p>
//                 )}
//               </div>

//               {/* Upload Photos */}
//               <div className="mt-3 mb-2 space-y-2">
//                 <label className="font-medium">Upload Photos</label>
//                 <div
//                   className="relative flex h-25 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:border-blue-400 hover:bg-blue-50"
//                   onClick={() => document.getElementById("fileInput")?.click()}
//                 >
//                   <input
//                     id="fileInput"
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="absolute inset-0 hidden"
//                   />
//                   <p className="text-gray-500">
//                     Drag & drop photos here or click to browse
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     You can upload multiple images (max 5)
//                   </p>
//                 </div>
//                 {errors.files && (
//                   <p className="text-xs text-red-500">{errors.files}</p>
//                 )}

//                 <div className="mt-3 grid grid-cols-1 gap-2">
//                   {/* Existing Images */}
//                   {/* {formData.existingFiles.map((url, idx) => (
//                     <div
//                       key={`exist-${idx}`}
//                       className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
//                     >
//                       <img
//                         src={url}
//                         alt={`img-${idx}`}
//                         className="h-full w-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             existingFiles: prev.existingFiles.filter(
//                               (_, i) => i !== idx,
//                             ),
//                           }))
//                         }
//                         className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   ))} */}

//                   {/* Newly Uploaded Files */}

//                   {/* {formData.existingFiles.map((url, idx) => (
//                     <div
//                       key={`exist-${idx}`}
//                       className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
//                     >
//                       <img
//                         src={url}
//                         alt={`img-${idx}`}
//                         className="h-full w-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             existingFiles: prev.existingFiles.filter(
//                               (_, i) => i !== idx,
//                             ),
//                           }))
//                         }
//                         className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   ))} */}

//                   {/* Existing uploaded images */}
//                   {formData.existingFiles.length > 0 && (
//                     <div className="mt-3 flex flex-wrap gap-3">
//                       {formData.existingFiles.map((url, idx) => (
//                         <div
//                           key={`exist-${idx}`}
//                           className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
//                         >
//                           <img
//                             src={url}
//                             alt={`existing-img-${idx}`}
//                             className="h-full w-full object-cover"
//                           />
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setFormData((prev) => ({
//                                 ...prev,
//                                 existingFiles: prev.existingFiles.filter(
//                                   (_, i) => i !== idx,
//                                 ),
//                               }))
//                             }
//                             className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
//                           >
//                             &times;
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Newly selected images (before upload) */}
//                   {formData.files.length > 0 && (
//                     <div className="mt-3 flex flex-wrap gap-3">
//                       {Array.from(formData.files).map((file, idx) => (
//                         <div
//                           key={`new-${idx}`}
//                           className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200"
//                         >
//                           <img
//                             src={URL.createObjectURL(file)}
//                             alt={`new-img-${idx}`}
//                             className="h-full w-full object-cover"
//                           />
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setFormData((prev) => ({
//                                 ...prev,
//                                 files: prev.files.filter((_, i) => i !== idx),
//                               }))
//                             }
//                             className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
//                           >
//                             &times;
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="mt-8 flex justify-end gap-4">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="cursor-pointer rounded-xl bg-gray-200 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="bg-secondary-dark hover:bg-secondary-light cursor-pointer rounded-xl px-6 py-2 text-base font-medium text-white"
//               >
//                 {editingProduct ? "Update" : "Add Product"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {viewProduct && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
//             <h3 className="mb-4 text-xl font-bold text-gray-800">
//               Product Details
//             </h3>
//             <div className="space-y-2 text-sm text-gray-700">
//               <p>
//                 <span className="font-semibold">Title:</span>{" "}
//                 {viewProduct.title}
//               </p>
//               <p>
//                 <span className="font-semibold">Description:</span>{" "}
//                 {viewProduct.description}
//               </p>
//               <p>
//                 <span className="font-semibold">Type:</span>{" "}
//                 {viewProduct.product_type}
//               </p>
//               <p>
//                 <span className="font-semibold">Age Range:</span>{" "}
//                 {viewProduct.age_range}
//               </p>
//               <p>
//                 <span className="font-semibold">Price:</span> $
//                 {viewProduct.price}
//               </p>
//               <p>
//                 <span className="font-semibold">Included:</span>{" "}
//                 {viewProduct.included.join(", ")}
//               </p>
//               {viewProduct.tutorial && (
//                 <p>
//                   <span className="font-semibold">Tutorial:</span>{" "}
//                   {viewProduct.tutorial}
//                 </p>
//               )}
//             </div>
//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setViewProduct(null)}
//                 className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Delete Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
//             <h3 className="mb-4 text-lg font-bold text-gray-800">
//               Confirm Delete
//             </h3>
//             <p className="text-sm text-gray-600">
//               Are you sure you want to delete{" "}
//               <span className="font-semibold">{confirmDelete.title}</span>?
//             </p>
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProductTable;

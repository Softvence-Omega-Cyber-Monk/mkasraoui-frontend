import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { ChevronDown, Search } from "lucide-react";
import toast from "react-hot-toast";
import Title from "@/components/Shared/Title";
import PageLoader from "@/components/Shared/PageLoader";

import type {
  IAffiliatedProduct,
  AffiliatedProductPayload,
} from "@/redux/types/IAffiliatedProduct.type";

import {
  useGetAffiliateProductsQuery,
  useCreateAffiliateProductMutation,
  useUpdateAffiliateProductMutation,
  useDeleteAffiliateProductMutation,
} from "@/redux/features/affiliatedProduct/affiliateProductApi";

interface AffiliatedProductFormType {
  title: string;
  price: string;
  avgRating: number;
  totalRatings: number;
  image_url: string;
  affiliated_company: string;
  link: string;
  age_range: string;
}

const IAffiliatedProductTable: React.FC = () => {
  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<IAffiliatedProduct | null>(null);
  const [viewProduct, setViewProduct] = useState<IAffiliatedProduct | null>(
    null,
  );
  const [confirmDelete, setConfirmDelete] = useState<IAffiliatedProduct | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [company, setCompany] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [ageRange, setAgeRange] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AffiliatedProductFormType>({
    defaultValues: {
      title: "",
      price: "",
      avgRating: 0,
      totalRatings: 0,
      image_url: "",
      affiliated_company: "",
      link: "",
      age_range: "",
    },
  });

  // --- API Hooks ---
  const { data, isLoading, isFetching, isError, refetch } =
    useGetAffiliateProductsQuery({ limit: 1000000 });
  const [createProduct, { isLoading: createLoading }] =
    useCreateAffiliateProductMutation();
  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateAffiliateProductMutation();
  const [deleteProduct] = useDeleteAffiliateProductMutation();

  const products: IAffiliatedProduct[] = data?.items || [];

  // --- Filtering Options ---
  const companies = useMemo(
    () => Array.from(new Set(products.map((p) => p.affiliated_company))).sort(),
    [products],
  );
  const ageOptions = useMemo(() => {
    // Extract unique age ranges from products
    return Array.from(new Set(products.map((p) => p.age_range))).sort();
  }, [products]);

  // --- Filtered + Searched Products ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (company) {
      result = result.filter((p) => p.affiliated_company === company);
    }
    if (priceRange) {
      result = result.filter((p) => {
        if (priceRange === "low") return p.price < 20;
        if (priceRange === "mid") return p.price >= 20 && p.price <= 50;
        if (priceRange === "high") return p.price > 50;
        return true;
      });
    }
    if (ageRange) {
      result = result.filter((p) => p.age_range === ageRange);
    }

    return result;
  }, [products, searchTerm, company, priceRange, ageRange]);

  // --- Pagination ---
  const [page, setPage] = useState(1);
  const productsPerPage = 9;
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages, page]);

  // --- Handlers ---
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };
  const handleCompanyChange = (value: string) => {
    setCompany(value);
    setPage(1);
  };
  const handlePriceChange = (value: string) => {
    setPriceRange(value);
    setPage(1);
  };
  const handleAgeChange = (value: string) => {
    setAgeRange(value);
    setPage(1);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    Object.keys(register).forEach((k) => setValue(k as any, ""));
    setIsModalOpen(true);
  };

  const openEditModal = (product: IAffiliatedProduct) => {
    setEditingProduct(product);
    setValue("title", product.title);
    setValue("price", product.price.toString());
    setValue("avgRating", product.avg_rating);
    setValue("totalRatings", product.total_review);
    setValue("image_url", product.image_url);
    setValue("affiliated_company", product.affiliated_company);
    setValue("link", product.link);
    setValue("age_range", product.age_range);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: AffiliatedProductFormType) => {
    const formattedPrice = Number(data.price.replace(/,/g, ""));
    if (isNaN(formattedPrice)) return toast.error("Invalid price");

    const payload: AffiliatedProductPayload = {
      title: data.title,
      price: formattedPrice,
      avgRating: Number(data.avgRating),
      totalRatings: Number(data.totalRatings),
      imageUrl: data.image_url,
      affiliatedCompany: data.affiliated_company,
      link: data.link,
      age_range: data.age_range,
    };

    if (payload.price < 0) return toast.error("Price must be >= 0");
    if (payload.avgRating < 0 || payload.avgRating > 5)
      return toast.error("Avg Rating must be 0-5");
    if (payload.totalRatings < 0)
      return toast.error("Total Ratings must be >= 0");

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, body: payload }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product added successfully");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProduct(confirmDelete.id).unwrap();
      toast.success("Product deleted successfully");
      setConfirmDelete(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title title="Affiliated Products" />
        <button
          onClick={openAddModal}
          className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105"
        >
          Add Affiliate Product
        </button>
      </div>

      {/* Filter Section */}
      <section className="mb-6">
        <div className="mx-auto flex flex-col items-center space-y-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative w-full flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search products or keywords..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            />
          </div>

          {/* Company Filter */}
          <div className="relative w-full sm:w-[180px]">
            <select
              value={company}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          </div>

          {/* Price Filter */}
          <div className="relative w-full sm:w-[180px]">
            <select
              value={priceRange}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            >
              <option value="">All Prices</option>
              <option value="low">Under €20</option>
              <option value="mid">€20 - €50</option>
              <option value="high">Above €50</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          </div>

          {/* Age Filter */}
          <div className="relative w-full sm:w-[180px]">
            <select
              value={ageRange}
              onChange={(e) => handleAgeChange(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            >
              <option value="">All Ages</option>
              {ageOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          </div>
        </div>
      </section>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] table-auto">
            <thead className="border-b border-gray-300 bg-gray-50">
              <tr>
                {[
                  "Title",
                  "Company",
                  "Price",
                  "Age Range",
                  "Image",
                  "Link",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left font-medium whitespace-nowrap text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center">
                    <PageLoader />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-red-500">
                    Error fetching products
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-300 transition duration-200 hover:bg-gray-50"
                  >
                    <td className="max-w-xs truncate px-6 py-4" title={p.title}>
                      {p.title.slice(0, 40)}...
                    </td>
                    <td
                      className="max-w-xs truncate px-6 py-4"
                      title={p.affiliated_company}
                    >
                      {p.affiliated_company}
                    </td>
                    <td className="px-6 py-4">€{p.price}</td>
                    <td className="px-6 py-4">{p.age_range}</td>
                    <td className="px-6 py-4">
                      {p.image_url ? (
                        <a
                          href={p.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.link ? (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Visit
                        </a>
                      ) : (
                        <span className="text-gray-500">No Link</span>
                      )}
                    </td>
                    <td className="flex gap-2 px-6 py-4">
                      <button
                        className="cursor-pointer rounded-lg bg-yellow-500 p-2 text-white hover:scale-105"
                        onClick={() => openEditModal(p)}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:scale-105"
                        onClick={() => setConfirmDelete(p)}
                      >
                        <MdDelete />
                      </button>
                      <button
                        className="cursor-pointer rounded-lg bg-[#0F1F4C] p-2 text-white hover:scale-105"
                        onClick={() => setViewProduct(p)}
                      >
                        <GrView />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
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
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {editingProduct ? "Edit Product" : "Add Affiliated Products"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-xl bg-gray-200 p-3"
              >
                X
              </button>
            </div>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-4"
            >
              {[
                { name: "title", label: "Title", type: "text" },
                {
                  name: "price",
                  label: "Price",
                  type: "text",
                  pattern: {
                    value: /^[0-9]+(\.[0-9]+)?$/,
                    message: "Price must be a valid number",
                  },
                },
                {
                  name: "avgRating",
                  label: "Average Rating(0-5)",
                  type: "number",
                  min: 0,
                  max: 5,
                  step: 0.1,
                },
                {
                  name: "totalRatings",
                  label: "Total Ratings",
                  type: "number",
                  min: 0,
                },
                {
                  name: "age_range",
                  label: "Age Range (e.g., 3-6 years)",
                  type: "text",
                },
                { name: "image_url", label: "Image URL", type: "text" },
                { name: "affiliated_company", label: "Company", type: "text" },
                { name: "link", label: "Product Link", type: "text" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    {...register(
                      field.name as keyof AffiliatedProductFormType,
                      {
                        required: `${field.label} is required`,
                        pattern: field.pattern,
                      },
                    )}
                    className="mt-1 rounded-xl border border-gray-300 p-2"
                  />
                  {errors[field.name as keyof AffiliatedProductFormType] && (
                    <span className="text-sm text-red-500">
                      {
                        errors[field.name as keyof AffiliatedProductFormType]
                          ?.message
                      }
                    </span>
                  )}
                </div>
              ))}
              {/* <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-xl bg-gray-300 px-5 py-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary-dark cursor-pointer rounded-xl px-5 py-2 text-white"
                >
                  {editingProduct ? "Update" : "Add Affi Product"}
                </button>
              </div> */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-xl bg-gray-300 px-5 py-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-secondary-dark cursor-pointer rounded-xl px-5 py-2 text-white"
                >
                  {editingProduct
                    ? updateLoading
                      ? "Updating..."
                      : "Update"
                    : createLoading
                      ? "Adding..."
                      : "Add Affi Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-sm rounded-lg bg-white p-6">
            <h3 className="mb-2 text-lg font-bold">Delete Product</h3>
            <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="cursor-pointer rounded-xl bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal  */}
      {viewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl scale-100 transform overflow-hidden rounded-2xl bg-white shadow-xl transition-transform duration-300 md:p-6">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {viewProduct.title}
              </h2>
              <button
                onClick={() => setViewProduct(null)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </header>

            {/* Main Content */}
            <main className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
              {/* Product Image */}
              {viewProduct.image_url && (
                <div className="flex justify-center md:col-span-1">
                  <img
                    src={viewProduct.image_url}
                    alt={viewProduct.title}
                    className="max-h-[400px] w-full rounded-xl border border-[#E5E7EB] object-contain shadow-md"
                  />
                </div>
              )}

              {/* Product Details */}
              <div className="flex flex-col justify-start space-y-3 text-gray-800 md:col-span-1">
                <p>
                  <span className="font-medium">Price:</span> €
                  {viewProduct.price}
                </p>
                <p>
                  <span className="font-medium">Company:</span>{" "}
                  {viewProduct.affiliated_company}
                </p>
                <p>
                  <span className="font-medium">Avg Rating:</span>{" "}
                  {viewProduct.avg_rating}
                </p>
                <p>
                  <span className="font-medium">Link:</span>{" "}
                  <a
                    href={viewProduct.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Visit Product
                  </a>
                </p>
                <p>
                  <span className="font-medium">Total Ratings:</span>{" "}
                  {viewProduct.total_review}
                </p>
                <p>
                  <span className="font-medium">Age Range:</span>{" "}
                  {viewProduct.age_range}
                </p>
              </div>
            </main>

            {/* Footer */}
            <footer className="flex justify-end border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setViewProduct(null)}
                className="cursor-pointer rounded-xl bg-gray-900 px-6 py-2 font-medium text-white transition hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default IAffiliatedProductTable;

// import { useEffect, useMemo, useState } from "react";
// import { useForm } from "react-hook-form";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
// import { ChevronDown, Search } from "lucide-react";
// import toast from "react-hot-toast";
// import Title from "@/components/Shared/Title";
// import PageLoader from "@/components/Shared/PageLoader";

// import type {
//   IAffiliatedProduct,
//   AffiliatedProductPayload,
// } from "@/redux/types/IAffiliatedProduct.type";

// import {
//   useGetAffiliateProductsQuery,
//   useCreateAffiliateProductMutation,
//   useUpdateAffiliateProductMutation,
//   useDeleteAffiliateProductMutation,
// } from "@/redux/features/affiliatedProduct/affiliateProductApi";

// interface AffiliatedProductFormType {
//   title: string;
//   price: string;
//   avgRating: number;
//   totalRatings: number;
//   image_url: string;
//   affiliated_company: string;
//   link: string;
//   age_range: string;
// }

// const IAffiliatedProductTable: React.FC = () => {
//   // --- States ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] =
//     useState<IAffiliatedProduct | null>(null);
//   const [viewProduct, setViewProduct] = useState<IAffiliatedProduct | null>(
//     null,
//   );
//   const [confirmDelete, setConfirmDelete] = useState<IAffiliatedProduct | null>(
//     null,
//   );

//   const [searchTerm, setSearchTerm] = useState("");
//   const [company, setCompany] = useState("");
//   const [priceRange, setPriceRange] = useState("");
//   // const [sortOption, setSortOption] = useState("");

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<AffiliatedProductFormType>({
//     defaultValues: {
//       title: "",
//       price: "",
//       avgRating: 0,
//       totalRatings: 0,
//       image_url: "",
//       affiliated_company: "",
//       link: "",
//       age_range: "",
//     },
//   });

//   // --- API Hooks ---
//   const { data, isLoading, isFetching, isError, refetch } =
//     useGetAffiliateProductsQuery({ limit: 1000000 });
//   const [createProduct] = useCreateAffiliateProductMutation();
//   const [updateProduct] = useUpdateAffiliateProductMutation();
//   const [deleteProduct] = useDeleteAffiliateProductMutation();

//   const products: IAffiliatedProduct[] = data?.items || [];

//   // --- Filtering + Searching + Sorting ---
//   const companies = useMemo(() => {
//     return Array.from(
//       new Set(products.map((p) => p.affiliated_company)),
//     ).sort();
//   }, [products]);

//   const filteredProducts = useMemo(() => {
//     let result = [...products];

//     // Search by keyword
//     if (searchTerm.trim()) {
//       result = result.filter((p) =>
//         p.title.toLowerCase().includes(searchTerm.toLowerCase()),
//       );
//     }

//     // Filter by company
//     if (company) {
//       result = result.filter((p) => p.affiliated_company === company);
//     }

//     // Filter by price
//     if (priceRange) {
//       result = result.filter((p) => {
//         if (priceRange === "low") return p.price < 20;
//         if (priceRange === "mid") return p.price >= 20 && p.price <= 50;
//         if (priceRange === "high") return p.price > 50;
//         return true;
//       });
//     }

//     return result;
//   }, [products, searchTerm, company, priceRange]);

//   // --- Pagination ---
//   const [page, setPage] = useState(1);
//   const productsPerPage = 9;
//   const total = filteredProducts.length;
//   const totalPages = Math.ceil(total / productsPerPage);

//   const paginatedProducts = filteredProducts.slice(
//     (page - 1) * productsPerPage,
//     page * productsPerPage,
//   );

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages || 1);
//   }, [totalPages, page]);

//   // --- Handlers ---
//   const handleSearchChange = (value: string) => {
//     setSearchTerm(value);
//     setPage(1);
//   };

//   const handleCompanyChange = (value: string) => {
//     setCompany(value);
//     setPage(1);
//   };

//   const handlePriceChange = (value: string) => {
//     setPriceRange(value);
//     setPage(1);
//   };

//   const openAddModal = () => {
//     setEditingProduct(null);
//     setValue("title", "");
//     setValue("price", "");
//     setValue("avgRating", 0);
//     setValue("totalRatings", 0);
//     setValue("image_url", "");
//     setValue("affiliated_company", "");
//     setValue("link", "");
//     setValue("age_range", "");
//     setIsModalOpen(true);
//   };

//   const openEditModal = (product: IAffiliatedProduct) => {
//     setEditingProduct(product);
//     setValue("title", product.title);
//     setValue("price", product.price.toString());
//     setValue("avgRating", product.avg_rating);
//     setValue("totalRatings", product.total_review);
//     setValue("image_url", product.image_url);
//     setValue("affiliated_company", product.affiliated_company);
//     setValue("link", product.link);
//     setValue("age_range", product.age_range);
//     setIsModalOpen(true);
//   };

//   const handleFormSubmit = async (data: AffiliatedProductFormType) => {
//     const formattedPrice = Number(data.price.replace(/,/g, ""));
//     if (isNaN(formattedPrice)) return toast.error("Invalid price");

//     const payload: AffiliatedProductPayload = {
//       title: data.title,
//       price: formattedPrice,
//       avgRating: Number(data.avgRating),
//       totalRatings: Number(data.totalRatings),
//       imageUrl: data.image_url,
//       affiliatedCompany: data.affiliated_company,
//       link: data.link,
//       age_range: data.age_range,
//     };

//     if (payload.price < 0) return toast.error("Price must be >= 0");
//     if (payload.avgRating < 0 || payload.avgRating > 5)
//       return toast.error("Avg Rating must be 0-5");
//     if (payload.totalRatings < 0)
//       return toast.error("Total Ratings must be >= 0");

//     try {
//       if (editingProduct) {
//         await updateProduct({ id: editingProduct.id, body: payload }).unwrap();
//         toast.success("Product updated successfully");
//       } else {
//         await createProduct(payload).unwrap();
//         toast.success("Product added successfully");
//       }
//       setIsModalOpen(false);
//       refetch();
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Something went wrong");
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirmDelete) return;
//     try {
//       await deleteProduct(confirmDelete.id).unwrap();
//       toast.success("Product deleted successfully");
//       setConfirmDelete(null);
//       refetch();
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <Title title="Affiliated Products" />
//         <button
//           onClick={openAddModal}
//           className="bg-secondary-dark hover:bg-secondary-light flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105"
//         >
//           Add Affiliate Product
//         </button>
//       </div>

//       {/* ✅ Filter Section */}
//       <section className="mb-6">
//         <div className="mx-auto flex flex-col items-center space-y-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:space-y-0 sm:space-x-4">
//           {/* Search */}
//           <div className="relative w-full flex-1">
//             <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search products or keywords..."
//               value={searchTerm}
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-gray-700 placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             />
//           </div>

//           {/* Company Filter */}
//           <div className="relative w-full sm:w-[180px]">
//             <select
//               value={company}
//               onChange={(e) => handleCompanyChange(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             >
//               <option value="">All Companies</option>
//               {companies.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
//           </div>

//           {/* Price Filter */}
//           <div className="relative w-full sm:w-[180px]">
//             <select
//               value={priceRange}
//               onChange={(e) => handlePriceChange(e.target.value)}
//               className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none"
//             >
//               <option value="">All Prices</option>
//               <option value="low">Under €20</option>
//               <option value="mid">€20 - €50</option>
//               <option value="high">Above €50</option>
//             </select>
//             <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-700" />
//           </div>
//         </div>
//       </section>
//       {/* Table */}
//       <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[1000px] table-auto">
//             <thead className="border-b border-gray-300 bg-gray-50">
//               <tr>
//                 {[
//                   "Title",
//                   "Company",
//                   "Price",
//                   "Age Range",
//                   "Image",
//                   "Link",
//                   "Actions",
//                 ].map((header) => (
//                   <th
//                     key={header}
//                     className="px-6 py-3 text-left font-medium whitespace-nowrap text-gray-700"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading || isFetching ? (
//                 <tr>
//                   <td colSpan={6} className="p-6 text-center">
//                     <PageLoader />
//                   </td>
//                 </tr>
//               ) : isError ? (
//                 <tr>
//                   <td colSpan={6} className="p-6 text-center text-red-500">
//                     Error fetching products
//                   </td>
//                 </tr>
//               ) : paginatedProducts.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="p-6 text-center text-gray-500">
//                     No products found.
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedProducts.map((p) => (
//                   <tr
//                     key={p.id}
//                     className="border-b border-gray-300 transition duration-200 hover:bg-gray-50"
//                   >
//                     <td className="max-w-xs truncate px-6 py-4" title={p.title}>
//                       {p.title.slice(0, 40)}...
//                     </td>
//                     <td
//                       className="max-w-xs truncate px-6 py-4"
//                       title={p.affiliated_company}
//                     >
//                       {p.affiliated_company}
//                     </td>
//                     <td className="px-6 py-4">€{p.price}</td>
//                     <td className="px-6 py-4">{p.age_range}</td>
//                     <td className="px-6 py-4">
//                       {p.image_url ? (
//                         <a
//                           href={p.image_url}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-blue-600 underline"
//                         >
//                           View
//                         </a>
//                       ) : (
//                         <span className="text-gray-500">No Image</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       {p.link ? (
//                         <a
//                           href={p.link}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-blue-600 underline"
//                         >
//                           Visit
//                         </a>
//                       ) : (
//                         <span className="text-gray-500">No Link</span>
//                       )}
//                     </td>
//                     <td className="flex gap-2 px-6 py-4">
//                       <button
//                         className="cursor-pointer rounded-lg bg-yellow-500 p-2 text-white hover:scale-105"
//                         onClick={() => openEditModal(p)}
//                       >
//                         <FaRegEdit />
//                       </button>
//                       <button
//                         className="cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:scale-105"
//                         onClick={() => setConfirmDelete(p)}
//                       >
//                         <MdDelete />
//                       </button>
//                       <button
//                         className="cursor-pointer rounded-lg bg-[#0F1F4C] p-2 text-white hover:scale-105"
//                         onClick={() => setViewProduct(p)}
//                       >
//                         <GrView />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}

//       {/* ✅ Simplified Pagination */}
//       {filteredProducts.length > 0 && (
//         <div className="mt-6 flex items-center justify-between px-4 py-3">
//           {/* Info text */}
//           <div className="text-sm text-gray-600">
//             Showing{" "}
//             <span className="font-medium">{paginatedProducts.length}</span> of{" "}
//             <span className="font-medium">{total}</span>
//           </div>

//           {/* Pagination Controls */}
//           <div className="flex items-center gap-2">
//             {/* Prev Button */}
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//             >
//               Prev
//             </button>

//             {/* Page Info */}
//             <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
//               {page} / {totalPages}
//             </div>

//             {/* Next Button */}
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page >= totalPages}
//               className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
//             <div className="mb-4 flex items-center justify-between">
//               <h3 className="text-xl font-semibold">
//                 {editingProduct ? "Edit Product" : "Add Affiliated Products"}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="cursor-pointer rounded-xl bg-gray-200 p-3"
//               >
//                 X
//               </button>
//             </div>

//             <form
//               onSubmit={handleSubmit(handleFormSubmit)}
//               className="flex flex-col gap-4"
//             >
//               {[
//                 { name: "title", label: "Title", type: "text" },
//                 {
//                   name: "price",
//                   label: "Price",
//                   type: "text",
//                   pattern: {
//                     value: /^[0-9]+(\.[0-9]+)?$/, // only numbers and optional decimal, no commas allowed
//                     message: "Price must be a valid number without commas",
//                   },
//                 },
//                 {
//                   name: "avgRating",
//                   label: "Average Rating(0-5)",
//                   type: "number",
//                   min: 0,
//                   max: 5,
//                   step: 0.1,
//                 },
//                 {
//                   name: "totalRatings",
//                   label: "Total Ratings",
//                   type: "number",
//                   min: 0,
//                 },
//                 {
//                   name: "age_range",
//                   label: "Age Range (e.g., 3-6 years)",
//                   type: "text",
//                 }, // ✅ NEW FIELD
//                 { name: "image_url", label: "Image URL", type: "text" },
//                 { name: "affiliated_company", label: "Company", type: "text" },
//                 { name: "link", label: "Product Link", type: "text" },
//               ].map((field) => (
//                 <div key={field.name} className="flex flex-col">
//                   <label>{field.label}</label>
//                   <input
//                     type={field.type}
//                     step={field.step}
//                     min={field.min}
//                     max={field.max}
//                     {...register(
//                       field.name as keyof AffiliatedProductFormType,
//                       {
//                         required: `${field.label} is required`,
//                         pattern: field.pattern,
//                       },
//                     )}
//                     className="mt-1 rounded-xl border border-gray-300 p-2"
//                   />
//                   {errors[field.name as keyof AffiliatedProductFormType] && (
//                     <span className="text-sm text-red-500">
//                       {
//                         errors[field.name as keyof AffiliatedProductFormType]
//                           ?.message
//                       }
//                     </span>
//                   )}
//                 </div>
//               ))}

//               <div className="mt-4 flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="cursor-pointer rounded-xl bg-gray-300 px-5 py-2 hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-secondary-dark cursor-pointer rounded-xl px-5 py-2 text-white"
//                 >
//                   {editingProduct ? "Update" : "Add Product"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="max-w-sm rounded-lg bg-white p-6">
//             <h3 className="mb-2 text-lg font-bold">Delete Product</h3>
//             <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="cursor-pointer rounded-xl bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {viewProduct && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="max-h-[80vh] max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
//             <h3 className="mb-4 text-xl font-semibold">{viewProduct.title}</h3>
//             <p>
//               <strong>Price:</strong> €{viewProduct.price}
//             </p>
//             <p>
//               <strong>Avg Rating:</strong> {viewProduct.avg_rating}
//             </p>
//             <p>
//               <strong>Total Ratings:</strong> {viewProduct.total_review}
//             </p>
//             <p>
//               <strong>Age Range:</strong> {viewProduct.age_range}
//             </p>
//             {viewProduct.image_url && (
//               <img
//                 src={viewProduct.image_url}
//                 alt={viewProduct.title}
//                 className="my-3 h-48 w-auto rounded border object-contain"
//               />
//             )}
//             <p>
//               <strong>Company:</strong> {viewProduct.affiliated_company}
//             </p>
//             <p>
//               <strong>Link:</strong>{" "}
//               <a
//                 href={viewProduct.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 Visit Product
//               </a>
//             </p>
//             <div className="mt-4 text-right">
//               <button
//                 onClick={() => setViewProduct(null)}
//                 className="bg-secondary-dark rounded-xl px-5 py-2 text-white"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default IAffiliatedProductTable;

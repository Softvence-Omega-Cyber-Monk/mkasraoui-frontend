import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GrView } from "react-icons/gr";
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
  price: number;
  avgRating: number;
  totalRatings: number;
  image_url: string;
  affiliated_company: string;
  link: string;
}

const IAffiliatedProductTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<IAffiliatedProduct | null>(null);
  const [viewProduct, setViewProduct] = useState<IAffiliatedProduct | null>(
    null,
  );
  const [confirmDelete, setConfirmDelete] = useState<IAffiliatedProduct | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AffiliatedProductFormType>({
    defaultValues: {
      title: "",
      price: 0,
      avgRating: 0,
      totalRatings: 0,
      image_url: "",
      affiliated_company: "",
      link: "",
    },
  });

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAffiliateProductsQuery({ limit: 1000000 });

  const [createProduct] = useCreateAffiliateProductMutation();
  const [updateProduct] = useUpdateAffiliateProductMutation();
  const [deleteProduct] = useDeleteAffiliateProductMutation();

  const products: IAffiliatedProduct[] = data?.items || [];

  // Pagination logic
  const [page, setPage] = useState(1);
  const productsPerPage = 10;

  const total = products.length;
  const totalPages = Math.ceil(total / productsPerPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages, page]);

  const paginatedProducts = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage,
  );

  // Handlers
  const openAddModal = () => {
    setEditingProduct(null);
    setValue("title", "");
    setValue("price", 0);
    setValue("avgRating", 0);
    setValue("totalRatings", 0);
    setValue("image_url", "");
    setValue("affiliated_company", "");
    setValue("link", "");
    setIsModalOpen(true);
  };

  const openEditModal = (product: IAffiliatedProduct) => {
    setEditingProduct(product);
    setValue("title", product.title);
    setValue("price", product.price);
    setValue("avgRating", product.avg_rating);
    setValue("totalRatings", product.total_review);
    setValue("image_url", product.image_url);
    setValue("affiliated_company", product.affiliated_company);
    setValue("link", product.link);
    setIsModalOpen(true);
  };

  const onSubmit = async (formData: AffiliatedProductFormType) => {
    const payload: AffiliatedProductPayload = {
      title: formData.title,
      price: Number(formData.price),
      avgRating: Number(formData.avgRating),
      totalRatings: Number(formData.totalRatings),
      imageUrl: formData.image_url,
      affiliatedCompany: formData.affiliated_company,
      link: formData.link,
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
          Add Affi Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] table-auto">
            <thead className="border-b border-gray-300 bg-gray-50">
              <tr>
                {["Title", "Company", "Price", "Image", "Link", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left font-medium text-gray-700"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    <PageLoader />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-red-500">
                    Error fetching products
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
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
                    <td className="px-6 py-4">${p.price}</td>
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
      {total > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{paginatedProducts.length}</span> of{" "}
            <span className="font-medium">{total}</span> products
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="cursor-pointer rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`rounded-md border px-3 py-1 text-sm ${
                  num === page
                    ? "bg-secondary-dark text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="cursor-pointer rounded-md border px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals (same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-xl bg-gray-200 p-3"
              >
                X
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {[
                { name: "title", label: "Title", type: "text" },
                { name: "price", label: "Price", type: "number" },
                { name: "avgRating", label: "Average Rating", type: "number" },
                {
                  name: "totalRatings",
                  label: "Total Ratings",
                  type: "number",
                },
                { name: "image_url", label: "Image URL", type: "text" },
                {
                  name: "affiliated_company",
                  label: "Affiliated Company",
                  type: "text",
                },
                { name: "link", label: "Link", type: "text" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    {...register(
                      field.name as keyof AffiliatedProductFormType,
                      {
                        required: `${field.label} is required`,
                      },
                    )}
                    className="rounded border border-gray-300 p-2"
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
                  {editingProduct ? "Update" : "Add Affi Product"}
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

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <h3 className="mb-4 text-xl font-semibold">{viewProduct.title}</h3>
            <p>
              <strong>Price:</strong> ${viewProduct.price}
            </p>
            <p>
              <strong>Avg Rating:</strong> {viewProduct.avg_rating}
            </p>
            <p>
              <strong>Total Ratings:</strong> {viewProduct.total_review}
            </p>
            {viewProduct.image_url && (
              <img
                src={viewProduct.image_url}
                alt={viewProduct.title}
                className="my-3 h-48 w-auto rounded border object-contain"
              />
            )}
            <p>
              <strong>Company:</strong> {viewProduct.affiliated_company}
            </p>
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={viewProduct.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Visit Product
              </a>
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setViewProduct(null)}
                className="bg-secondary-dark rounded-xl px-5 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IAffiliatedProductTable;

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
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
//   price: number;
//   avgRating: number;
//   totalRatings: number;
//   image_url: string;
//   affiliated_company: string;
//   link: string;
// }

// const IAffiliatedProductTable: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] =
//     useState<IAffiliatedProduct | null>(null);
//   const [viewProduct, setViewProduct] = useState<IAffiliatedProduct | null>(
//     null,
//   );
//   const [confirmDelete, setConfirmDelete] = useState<IAffiliatedProduct | null>(
//     null,
//   );

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<AffiliatedProductFormType>({
//     defaultValues: {
//       title: "",
//       price: 0,
//       avgRating: 0,
//       totalRatings: 0,
//       image_url: "",
//       affiliated_company: "",
//       link: "",
//     },
//   });

//   const { data, isLoading, isFetching, isError, refetch } =
//     useGetAffiliateProductsQuery({ limit: 1000 });
//   const [createProduct] = useCreateAffiliateProductMutation();
//   const [updateProduct] = useUpdateAffiliateProductMutation();
//   const [deleteProduct] = useDeleteAffiliateProductMutation();

//   const products: IAffiliatedProduct[] = data?.items || [];

//   // Pagination
//   const [page, setPage] = useState(1);
//   const productsPerPage = 4;
//   const total = products.length;
//   const totalPages = Math.ceil(total / productsPerPage);

//   useEffect(() => setPage(1), [total]);

//   const paginatedproducts = products.slice(
//     (page - 1) * productsPerPage,
//     page * productsPerPage,
//   );

//   const openAddModal = () => {
//     setEditingProduct(null);
//     setValue("title", "");
//     setValue("price", 0);
//     setValue("avgRating", 0);
//     setValue("totalRatings", 0);
//     setValue("image_url", "");
//     setValue("affiliated_company", "");
//     setValue("link", "");
//     setIsModalOpen(true);
//   };

//   const openEditModal = (product: IAffiliatedProduct) => {
//     setEditingProduct(product);
//     setValue("title", product.title);
//     setValue("price", product.price);
//     setValue("avgRating", product.avg_rating);
//     setValue("totalRatings", product.total_review);
//     setValue("image_url", product.image_url);
//     setValue("affiliated_company", product.affiliated_company);
//     setValue("link", product.link);
//     setIsModalOpen(true);
//   };

//   const onSubmit = async (formData: AffiliatedProductFormType) => {
//     const payload: AffiliatedProductPayload = {
//       title: formData.title,
//       price: Number(formData.price),
//       avgRating: Number(formData.avgRating),
//       totalRatings: Number(formData.totalRatings),
//       imageUrl: formData.image_url,
//       affiliatedCompany: formData.affiliated_company,
//       link: formData.link,
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
//           Add Affi Product
//         </button>
//       </div>

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
//                   "Image URL",
//                   "Link",
//                   "Actions",
//                 ].map((header) => (
//                   <th
//                     key={header}
//                     className="px-6 py-3 text-left font-medium text-gray-700"
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
//               ) : products.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="p-6 text-center text-gray-500">
//                     No products found.
//                   </td>
//                 </tr>
//               ) : (
//                 products.map((p) => (
//                   <tr
//                     key={p.id}
//                     className="border-b border-gray-300 transition duration-200 hover:bg-gray-50"
//                   >
//                     <td
//                       className="max-w-xs truncate px-6 py-4 whitespace-nowrap"
//                       title={p.title}
//                     >
//                       {p.title.slice(0, 30)}....
//                     </td>
//                     <td
//                       className="max-w-xs truncate px-6 py-4 whitespace-nowrap"
//                       title={p.affiliated_company}
//                     >
//                       {p.affiliated_company}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">${p.price}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {p.image_url ? (
//                         <a
//                           href={p.image_url}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="block max-w-[150px] truncate text-blue-600 underline"
//                         >
//                           Visit
//                         </a>
//                       ) : (
//                         <span className="text-sm text-gray-500">No Image</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {p.link ? (
//                         <a
//                           href={p.link}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="block max-w-[150px] truncate text-blue-600 underline"
//                         >
//                           Visit
//                         </a>
//                       ) : (
//                         <span className="text-sm text-gray-500">No Link</span>
//                       )}
//                     </td>
//                     <td className="flex justify-center gap-2 px-6 py-4">
//                       <button
//                         className="cursor-pointer rounded-lg bg-yellow-500 p-2 text-white transition hover:scale-105"
//                         onClick={() => openEditModal(p)}
//                       >
//                         <FaRegEdit />
//                       </button>
//                       <button
//                         className="cursor-pointer rounded-lg bg-red-600 p-2 text-white transition hover:scale-105"
//                         onClick={() => setConfirmDelete(p)}
//                       >
//                         <MdDelete />
//                       </button>
//                       <button
//                         className="cursor-pointer rounded-lg bg-[#0F1F4C] p-2 text-white transition hover:scale-105"
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
//       {products.length > 0 && (
//         <div className="mt-6 flex items-center justify-between px-4 py-3">
//           <div className="text-sm text-gray-600">
//             Showing{" "}
//             <span className="font-medium">{paginatedproducts.length}</span> of{" "}
//             <span className="font-medium">{total}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1}
//               className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <div className="min-w-[50px] rounded-md border bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700">
//               {page} / {totalPages}
//             </div>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page >= totalPages}
//               className="rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
//             <div className="mb-4 flex items-center justify-between">
//               <h3 className="text-xl font-semibold">
//                 {editingProduct ? "Edit Product" : "Add Affiliated Product"}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="cursor-pointer rounded-xl bg-gray-200 p-3"
//               >
//                 X
//               </button>
//             </div>

//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="flex flex-col gap-4"
//             >
//               {/* Title */}
//               <div className="flex flex-col">
//                 <label>Title</label>
//                 <input
//                   type="text"
//                   placeholder="Title"
//                   {...register("title", { required: "Title is required" })}
//                   className="rounded border border-gray-300 p-2"
//                 />
//                 {errors.title && (
//                   <span className="text-red-500">{errors.title.message}</span>
//                 )}
//               </div>

//               {/* Price */}
//               <div className="flex flex-col">
//                 <label>Price</label>
//                 <input
//                   type="number"
//                   step="0.1"
//                   placeholder="Price"
//                   {...register("price", {
//                     required: "Price is required",
//                     min: { value: 0, message: "Price must be >= 0" },
//                   })}
//                   className="rounded border border-gray-300 p-2"
//                 />
//                 {errors.price && (
//                   <span className="text-red-500">{errors.price.message}</span>
//                 )}
//               </div>

//               {/* Average Rating */}
//               <div className="flex flex-col">
//                 <label>Average Rating</label>
//                 <input
//                   placeholder="Average Rating"
//                   type="number"
//                   step="0.1"
//                   {...register("avgRating", {
//                     required: "Average rating is required",
//                     min: { value: 0, message: "Rating must be >= 0" },
//                     max: { value: 5, message: "Rating must be <= 5" },
//                   })}
//                   className="rounded border border-gray-300 p-2"
//                 />
//                 {errors.avgRating && (
//                   <span className="text-red-500">
//                     {errors.avgRating.message}
//                   </span>
//                 )}
//               </div>

//               {/* Total Ratings */}
//               <div className="flex flex-col">
//                 <label>Total Ratings</label>
//                 <input
//                   placeholder="Total Ratings"
//                   type="number"
//                   {...register("totalRatings", {
//                     required: "Total ratings are required",
//                     min: { value: 0, message: "Total ratings must be >= 0" },
//                   })}
//                   className="rounded border border-gray-300 p-2"
//                 />
//                 {errors.totalRatings && (
//                   <span className="text-red-500">
//                     {errors.totalRatings.message}
//                   </span>
//                 )}
//               </div>

//               {/* Image URL */}
//               <div className="flex flex-col">
//                 <label>Image URL</label>
//                 <input
//                   placeholder="Image URL"
//                   type="text"
//                   {...register("image_url", {
//                     required: "Image URL is required",
//                   })}
//                   className="rounded border border-gray-300 p-2"
//                 />
//                 {errors.image_url && (
//                   <span className="text-red-500">
//                     {errors.image_url.message}
//                   </span>
//                 )}
//               </div>

//               {/* Affiliated Company */}
//               <div className="flex flex-col">
//                 <label>Affiliated Company</label>
//                 <input
//                   placeholder="Affiliated Company"
//                   type="text"
//                   {...register("affiliated_company", {
//                     required: "Affiliated company is required",
//                   })}
//                   className="rounded border border-gray-300 p-2"
//                 />
//                 {errors.affiliated_company && (
//                   <span className="text-red-500">
//                     {errors.affiliated_company.message}
//                   </span>
//                 )}
//               </div>

//               {/* Link */}
//               <div className="flex flex-col">
//                 <label>Link</label>
//                 <input
//                   placeholder="Link"
//                   type="text"
//                   {...register("link", { required: "Link is required" })}
//                   className="rounded border border-gray-300 p-2"
//                 />
//                 {errors.link && (
//                   <span className="text-red-500">{errors.link.message}</span>
//                 )}
//               </div>

//               {/* Buttons */}
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
//                   {editingProduct ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {confirmDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="max-w-sm rounded-lg bg-white p-6">
//             <h3 className="mb-2 text-lg font-bold">Delete Product</h3>
//             <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-400 px-4 py-3 text-white hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {viewProduct && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="max-h-[80vh] max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
//             <h3 className="mb-4 text-xl font-semibold">{viewProduct.title}</h3>
//             <p>
//               <strong>Price:</strong> ${viewProduct.price}
//             </p>
//             <p>
//               <strong>Avg Rating:</strong> {viewProduct.avg_rating}
//             </p>
//             <p>
//               <strong>Total Ratings:</strong> {viewProduct.total_review}
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
//                 className="bg-secondary-dark cursor-pointer rounded-xl px-5 py-2 text-white"
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

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import { GrView } from "react-icons/gr";
// import toast from "react-hot-toast";
// import Title from "@/components/Shared/Title";
// import PageLoader from "@/components/Shared/PageLoader";

// import type { IAffiliatedProduct } from "@/redux/types/IAffiliatedProduct.type";
// import {
//     useGetAffiliateProductsQuery,
//     useCreateAffiliateProductMutation,
//     useUpdateAffiliateProductMutation,
//     useDeleteAffiliateProductMutation,
// } from "@/redux/features/affiliatedProduct/affiliateProductApi";

// interface AffiliatedProductFormType {
//     title: string;
//     price: number;
//     avgRating: number;
//     totalRatings: number;
//     image_url: string;
//     affiliated_company: string;
//     link: string;
// }

// const IAffiliatedProductTable: React.FC = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProduct, setEditingProduct] = useState<IAffiliatedProduct | null>(null);
//     const [viewProduct, setViewProduct] = useState<IAffiliatedProduct | null>(null);
//     const [confirmDelete, setConfirmDelete] = useState<IAffiliatedProduct | null>(null);

//     const { register, handleSubmit, setValue, formState: { errors } } =
//         useForm<AffiliatedProductFormType>({
//             defaultValues: {
//                 title: "",
//                 price: 0,
//                 avg_rating: 0,
//                 total_review: 0,
//                 image_url: "",            // frontend name
//                 affiliated_company: "",   // frontend name
//                 link: "",
//             },
//         });

//     const { data, isLoading, isFetching, isError, refetch } = useGetAffiliateProductsQuery();
//     const [createProduct] = useCreateAffiliateProductMutation();
//     const [updateProduct] = useUpdateAffiliateProductMutation();
//     const [deleteProduct] = useDeleteAffiliateProductMutation();
//     console.log(data, "Aff data")
//     console.log(createProduct)
//     console.log(updateProduct)
//     console.log(deleteProduct)

//     const products: IAffiliatedProduct[] =
//         data?.items?.map((p: any) => ({
//             id: p.id ?? "",
//             title: p.title ?? "",
//             price: p.price ?? 0,
//             avgRating: p.avg_rating ?? 0,
//             totalRatings: p.total_review ?? 0,
//             image_url: p.image_url ?? "",
//             affiliated_company: p.affiliated_company ?? "",
//             link: p.link ?? "",
//         })) || [];
//     const openAddModal = () => {
//         setEditingProduct(null);
//         setValue("title", "");
//         setValue("price", 0);
//         setValue("avgRating", 0);
//         setValue("totalRatings", 0);
//         setValue("image_url", "");
//         setValue("affiliated_company", "");
//         setValue("link", "");
//         setIsModalOpen(true);
//     };
//     const openEditModal = (product: IAffiliatedProduct) => {
//         setEditingProduct(product);
//         setValue("title", product.title);
//         setValue("price", product.price);
//         setValue("avgRating", product.avg_rating);
//         setValue("totalRatings", product.total_review);
//         setValue("image_url", product.image_url);
//         setValue("affiliated_company", product.affiliated_company);
//         setValue("link", product.link);
//         setIsModalOpen(true);
//     };

//     const onSubmit = async (formData: AffiliatedProductFormType) => {
//         // Map frontend form fields to backend API fields
//         const payload: Partial<IAffiliatedProduct> = {
//             title: formData.title,
//             price: Number(formData.price),
//             avgRating: Number(formData.avgRating),
//             totalRatings: Number(formData.totalRatings),
//             imageUrl: formData.image_url,          // <-- Swagger expects camelCase
//             affiliatedCompany: formData.affiliated_company, // <-- Swagger expects camelCase
//             link: formData.link,
//         };

//         // Validation
//         if (payload.price! < 0) return toast.error("Price must be >= 0");
//         if (payload.avgRating! < 0 || payload.avgRating! > 5) return toast.error("Average Rating must be 0-5");
//         if (payload.totalRatings! < 0) return toast.error("Total Ratings must be >= 0");

//         try {
//             if (editingProduct) {
//                 await updateProduct({ id: editingProduct.id, body: payload }).unwrap();
//                 toast.success("Product updated successfully");
//             } else {
//                 await createProduct(payload).unwrap();
//                 toast.success("Product added successfully");
//             }
//             setIsModalOpen(false);
//             refetch();
//         } catch (err: any) {
//             toast.error(err?.data?.message || "Something went wrong");
//         }
//     };

//     const handleDelete = async () => {
//         if (!confirmDelete) return;
//         try {
//             await deleteProduct(confirmDelete.id).unwrap();
//             toast.success("Product deleted successfully");
//             setConfirmDelete(null);
//             refetch();
//         } catch (err: any) {
//             toast.error(err?.data?.message || "Delete failed");
//         }
//     };

//     return (
//         <div>
//             {/* Header */}
//             <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <Title title="Affiliated Products" />
//                 <button
//                     onClick={openAddModal}
//                     className="bg-secondary-dark hover:bg-secondary-light cursor-pointer flex items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105"
//                 >
//                     Add Product
//                 </button>
//             </div>

//             {/* Table */}
//             <div className="rounded-lg border border-gray-300 bg-white">
//                 {/* <table className="w-full min-w-[1000px]">
//                     <thead className="border-b border-gray-300 bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left">Title</th>
//                             <th className="px-6 py-3 text-left">Company</th>
//                             <th className="px-6 py-3 text-left">Price</th>
//                             <th className="px-6 py-3 text-left">Image URL</th>
//                             <th className="px-6 py-3 text-left">Link</th>
//                             <th className="px-6 py-3 text-center">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products.length === 0 ? (
//                             <tr>
//                                 <td colSpan={6} className="p-6 text-center text-gray-500">
//                                     No products found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             products.map((p) => (
//                                 <tr key={p.id} className="border-b border-gray-300 hover:bg-gray-50">
//                                     <td className="px-6 w-2xl py-4 whitespace-nowrap">{p.title}</td>

//                                      <td className="px-6 w-2xl py-4 whitespace-nowrap">{p.affiliated_company}</td>

//                                     <td className="px-6 w-2xl py-4 whitespace-nowrap">${p.price}</td>

//                                      <td className="px-6 w-2xl py-4 whitespace-nowrap">

//                                         <a
//                                             href={p.image_url}
//                                             target="_blank"
//                                             rel="noreferrer"
//                                             className="text-blue-600 underline"
//                                         >
//                                             Visit
//                                         </a>

//                                     </td>

//                                     <td className="px-6 w-2xl py-4 whitespace-nowrap">
//                                         <a
//                                             href={p.link}
//                                             target="_blank"
//                                             rel="noreferrer"
//                                             className="text-blue-600 underline"
//                                         >
//                                             Visit
//                                         </a>
//                                     </td>

//                                      <td className="flex justify-center gap-2 px-6 py-4">
//                                         <button
//                                             onClick={() => openEditModal(p)}
//                                             className="rounded-lg bg-yellow-500 p-2 text-white"
//                                         >
//                                             <FaRegEdit />
//                                         </button>
//                                         <button
//                                             onClick={() => setConfirmDelete(p)}
//                                             className="rounded-lg bg-red-600 p-2 text-white"
//                                         >
//                                             <MdDelete />
//                                         </button>
//                                         <button
//                                             onClick={() => setViewProduct(p)}
//                                             className="rounded-lg bg-[#0F1F4C] p-2 text-white"
//                                         >
//                                             <GrView />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>

//                 </table> */}

//                 <table className="w-full min-w-[1000px] table-auto">
//                     <thead className="bg-gray-50 border-b border-gray-300">
//                         <tr>
//                             {["Title", "Company", "Price", "Image URL", "Link", "Actions"].map((header) => (
//                                 <th key={header} className="px-6 py-3 text-left font-medium text-gray-700">
//                                     {header}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {isLoading || isFetching ? (
//                             <tr>
//                                 <td colSpan={6} className="p-6 text-center">
//                                     <PageLoader />
//                                 </td>
//                             </tr>
//                         ) : isError ? (
//                             <tr>
//                                 <td colSpan={6} className="p-6 text-center text-red-500">
//                                     Error fetching products
//                                 </td>
//                             </tr>
//                         ) : products.length === 0 ? (
//                             <tr>
//                                 <td colSpan={6} className="p-6 text-center text-gray-500">
//                                     No products found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             products.map((p) => (
//                                 <tr key={p.id} className="border-b border-gray-300 hover:bg-gray-50 transition duration-200">
//                                     <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate" title={p.title}>
//                                         {p.title.slice(0,30)}..
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate" title={p.affiliated_company}>
//                                         {p.affiliated_company}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">${p.price}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         {p.image_url ? (
//                                             <a
//                                                 href={p.image_url}
//                                                 target="_blank"
//                                                 rel="noreferrer"
//                                                 className="text-blue-600 underline hover:text-blue-800 truncate block max-w-[150px]"
//                                                 title={p.image_url}
//                                             >
//                                                 Visit
//                                             </a>
//                                         ) : (
//                                             <span className="text-sm text-gray-500">No Image</span>
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         {p.link ? (
//                                             <a
//                                                 href={p.link}
//                                                 target="_blank"
//                                                 rel="noreferrer"
//                                                 className="text-blue-600 underline hover:text-blue-800 truncate block max-w-[150px]"
//                                                 title={p.link}
//                                             >
//                                                 Visit
//                                             </a>
//                                         ) : (
//                                             <span className="text-sm text-gray-500">No Link</span>
//                                         )}
//                                     </td>
//                                     <td className="flex justify-center gap-2 px-6 py-4">
//                                         <button
//                                             className="rounded-lg bg-yellow-500 p-2 text-white hover:cursor-pointer hover:scale-105 transition"
//                                             onClick={() => openEditModal(p)}
//                                         >
//                                             <FaRegEdit />
//                                         </button>
//                                         <button
//                                             className="rounded-lg bg-red-600 p-2 text-white hover:cursor-pointer hover:scale-105 transition"
//                                             onClick={() => setConfirmDelete(p)}
//                                         >
//                                             <MdDelete />
//                                         </button>
//                                         <button
//                                             className="rounded-lg bg-[#0F1F4C] p-2 text-white hover:cursor-pointer hover:scale-105 transition"
//                                             onClick={() => setViewProduct(p)}
//                                         >
//                                             <GrView />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>

//             </div>

//             {/* Add/Edit Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//                     <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
//                         <div className="mb-4 flex items-center justify-between">
//                             <h3 className="text-xl font-semibold">{editingProduct ? "Edit Product" : "Add Product"}</h3>
//                             <button onClick={() => setIsModalOpen(false)} className="rounded-xl bg-gray-200 p-3">X</button>
//                         </div>
//                         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//                             <label>Title</label>
//                             <input {...register("title", { required: true })} className="rounded border border-gray-300 p-2" />
//                             {errors.title && <span className="text-red-500">Title required</span>}

//                             <label>Price</label>
//                             <input type="number" step="0.01" {...register("price", { required: true, min: 0 })} className="rounded border border-gray-300 p-2" />
//                             {/* {errors.price && <span className="text-red-500">Price must be >= 0</span>} */}

//                             <label>Average Rating</label>
//                             <input type="number" step="0.1" {...register("avgRating", { required: true, min: 0, max: 5 })} className="rounded border border-gray-300 p-2" />
//                             {errors.avg_rating && <span className="text-red-500">0 ≤ Avg Rating ≤ 5</span>}

//                             <label>Total Ratings</label>
//                             <input type="number" {...register("totalRatings", { required: true, min: 0 })} className="rounded border border-gray-300 p-2" />
//                             {errors.total_review && <span className="text-red-500">Total Ratings must be ≥ 0</span>}

//                             <label>Image URL</label>
//                             <input {...register("image_url", { required: true })} className="rounded border border-gray-300 p-2" />
//                             {errors.image_url && <span className="text-red-500">Image URL required</span>}

//                             <label>Affiliated Company</label>
//                             <input {...register("affiliated_company", { required: true })} className="rounded border border-gray-300 p-2" />
//                             {errors.affiliated_company && <span className="text-red-500">Company required</span>}

//                             <label>Link</label>
//                             <input {...register("link", { required: true })} className="rounded border border-gray-300 p-2" />
//                             {errors.link && <span className="text-red-500">Link required</span>}

//                             <div className="mt-4 flex justify-end gap-2">
//                                 <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl bg-gray-300 px-5 cursor-pointer py-2 hover:bg-gray-400">Cancel</button>
//                                 <button type="submit" className="bg-secondary-dark cursor-pointer hover:bg-secondary-light rounded-xl px-5 py-2 text-white">{editingProduct ? "Update" : "Add"}</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Modal */}
//             {confirmDelete && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//                     <div className="max-w-sm rounded-lg bg-white p-6">
//                         <h3 className="mb-2 text-lg font-bold">Delete Product</h3>
//                         <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
//                         <div className="mt-4 flex justify-end gap-2">
//                             <button onClick={() => setConfirmDelete(null)} className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-gray-400 px-4 py-3 text-base font-medium text-white hover:bg-gray-500">Cancel</button>
//                             <button onClick={handleDelete} className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-base font-medium text-white hover:bg-red-700">Delete</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {viewProduct && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//                     <div className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6">
//                         <h3 className="mb-4 text-xl font-semibold">{viewProduct.title}</h3>

//                         <p><strong>Price:</strong> ${viewProduct.price}</p>
//                         <p><strong>Avg Rating:</strong> {viewProduct.avgRating}</p>
//                         <p><strong>Total Ratings:</strong> {viewProduct.totalRatings}</p>

//                         <td className="px-6 py-4 whitespace-nowrap">
//                             {/* <td className="px-6 py-4 whitespace-nowrap">{viewProduct.affiliated_company}</td> */}
//                             {viewProduct.image_url ? (
//                                 <div className="my-3">
//                                     <strong>Image:</strong>
//                                     <img
//                                         src={viewProduct.image_url}      // URL from backend
//                                         alt={viewProduct.title}         // alt text
//                                         className="mt-2 h-48 w-auto rounded border object-contain" // larger and readable
//                                     />
//                                 </div>
//                             ) : (
//                                 <span className="text-gray-500">No Image</span>
//                             )}
//                         </td>

//                         <p><strong>Company:</strong> {viewProduct.affiliated_company}</p>

//                         <p>
//                             <strong>Link:</strong>{" "}
//                             <a href={viewProduct.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                                 Visit Product
//                             </a>
//                         </p>

//                         <div className="mt-4 text-right">
//                             <button
//                                 onClick={() => setViewProduct(null)}
//                                 className="bg-secondary-dark cursor-pointer hover:bg-secondary-light rounded-xl px-5 py-2 text-white"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default IAffiliatedProductTable;

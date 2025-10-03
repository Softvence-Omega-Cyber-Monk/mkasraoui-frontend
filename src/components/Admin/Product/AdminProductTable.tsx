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
import { Plus } from "lucide-react";
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
}

const AdminProductTable: React.FC = () => {
  const { data, isLoading, isFetching } = useGetProductsQuery();
  // const products: Product[] = data?.data ?? [];

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
  });

  // 👉 Frontend Pagination
  const [page, setPage] = useState(1);
  const productsPerPage = 10;
  const total = products.length;
  const totalPages = Math.ceil(total / productsPerPage);

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

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
    });
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
    });
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
    setFormData((prev) => ({
      ...prev,
      files: e.target.files ? Array.from(e.target.files) : [],
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = new FormData();

      // Prepare payload
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
      };

      // Append as JSON string
      dataToSend.append("data", JSON.stringify(payload));

      // Append files
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
      });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting product");
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Title title="Products" />

        <button
          onClick={openAddModal}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
        >
          <Plus className="h-5 w-5" /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Description
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Age Range
                </th>
                <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-6 py-5 text-center text-sm font-medium text-gray-500">
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
                    {/* Loading products... */}
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
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.description.split(" ").slice(0, 5).join(" ")}
                      {product.description.split(" ").length > 5 && " ..."}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.product_type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.age_range}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${product.price}
                    </td>
                    <td className="flex justify-center space-x-2 px-6 py-4">
                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex cursor-pointer items-center justify-center rounded-md bg-yellow-500 p-2 text-white transition-colors hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                        title="Edit Plan"
                      >
                        <FaRegEdit className="h-4 w-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setConfirmDelete(product)}
                        className="flex cursor-pointer items-center justify-center rounded-md bg-red-600 p-2 text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
                        title="Delete Plan"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewProduct(product)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-emerald-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:ring-2 focus:outline-none"
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
                className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <div className="min-w-[50px] rounded-md border border-[#E3E3E4] bg-gray-50 px-3 py-1.5 text-center text-sm font-medium text-gray-700 shadow-sm">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                rows={3}
              />
              <input
                type="text"
                placeholder="Product Type"
                value={formData.product_type}
                onChange={(e) =>
                  setFormData({ ...formData, product_type: e.target.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Age Range"
                value={formData.age_range}
                onChange={(e) =>
                  setFormData({ ...formData, age_range: e.target.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Included Items (comma separated)"
                value={formData.included}
                onChange={(e) =>
                  setFormData({ ...formData, included: e.target.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Tutorial Link"
                value={formData.tutorial}
                onChange={(e) =>
                  setFormData({ ...formData, tutorial: e.target.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Activities (title::description | ...)"
                value={formData.activities}
                onChange={(e) =>
                  setFormData({ ...formData, activities: e.target.value })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingProduct ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/*  */}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl">
            {/* Header */}
            <h3 className="mb-6 text-2xl font-semibold text-gray-900">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
                rows={4}
              />
              {/* <input
                type="text"
                placeholder="Product Type"
                value={formData.product_type}
                onChange={(e) =>
                  setFormData({ ...formData, product_type: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              /> */}

              <select
                value={formData.product_type}
                onChange={(e) =>
                  setFormData({ ...formData, product_type: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              >
                <option value="">Select Product Type</option>
                <option value="DIY_BOX">DIY Box</option>
                <option value="GIFT">Gift</option>
              </select>

              <input
                type="text"
                placeholder="Age Range"
                value={formData.age_range}
                onChange={(e) =>
                  setFormData({ ...formData, age_range: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              />
              <input
                type="text"
                placeholder="Included Items (comma separated)"
                value={formData.included}
                onChange={(e) =>
                  setFormData({ ...formData, included: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              />
              <input
                type="text"
                placeholder="Tutorial Link"
                value={formData.tutorial}
                onChange={(e) =>
                  setFormData({ ...formData, tutorial: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              />
              <input
                type="text"
                placeholder="Activities (title::description | ...)"
                value={formData.activities}
                onChange={(e) =>
                  setFormData({ ...formData, activities: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring focus:ring-blue-100"
              />
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:ring focus:ring-blue-100 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-lg bg-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
// }

// const AdminProductTable: React.FC = () => {
//   const { data, isLoading, isFetching } = useGetProductsQuery();
//   // const products: Product[] = data?.data ?? [];

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
//   });

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
//     });
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
//     });
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
//     setFormData((prev) => ({
//       ...prev,
//       files: e.target.files ? Array.from(e.target.files) : [],
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const dataToSend = new FormData();

//       // Prepare payload
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
//       };

//       // Append as JSON string
//       dataToSend.append("data", JSON.stringify(payload));

//       // Append files
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
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("Error submitting product");
//     }
//   };

//   return (
//     <div className="">
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <Title title="Products" />

//         <button
//           onClick={openAddModal}
//           className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
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
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Title
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Description
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Type
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Age Range
//                 </th>
//                 <th className="px-6 py-5 text-left text-sm font-medium text-gray-700">
//                   Price
//                 </th>
//                 <th className="px-6 py-5 text-center text-sm font-medium text-gray-500">
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
//                     {/* Loading products... */}
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
//                 products.map((product) => (
//                   <tr
//                     key={product.id}
//                     className="border-b border-gray-100 hover:bg-gray-50"
//                   >
//                     <td className="px-6 py-4 text-sm font-semibold text-gray-900">
//                       {product.title}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {product.description.split(" ").slice(0, 5).join(" ")}
//                       {product.description.split(" ").length > 5 && " ..."}
//                     </td>

//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {product.product_type}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {product.age_range}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       ${product.price}
//                     </td>
//                     <td className="flex justify-center space-x-2 px-6 py-4">
//                       <td className="flex space-x-2 px-6 py-4">
//                         {/* Edit Button */}
//                         <button
//                           onClick={() => openEditModal(product)}
//                           className="flex cursor-pointer items-center justify-center rounded-md bg-yellow-500 p-2 text-white transition-colors hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
//                           title="Edit Plan"
//                         >
//                           <FaRegEdit className="h-4 w-4" />
//                         </button>

//                         {/* Delete Button */}
//                         <button
//                           onClick={() => setConfirmDelete(product)}
//                           className="flex cursor-pointer items-center justify-center rounded-md bg-red-600 p-2 text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none"
//                           title="Delete Plan"
//                         >
//                           <MdDelete className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => setViewProduct(product)}
//                           className="flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-emerald-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:ring-2 focus:outline-none"
//                         >
//                           <GrView className="h-4 w-4" />
//                         </button>
//                       </td>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//       </div>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
//             <h3 className="mb-4 text-xl font-bold text-gray-800">
//               {editingProduct ? "Edit Product" : "Add Product"}
//             </h3>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Title"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//               />
//               <textarea
//                 placeholder="Description"
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//                 rows={3}
//               />
//               <input
//                 type="text"
//                 placeholder="Product Type"
//                 value={formData.product_type}
//                 onChange={(e) =>
//                   setFormData({ ...formData, product_type: e.target.value })
//                 }
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//               />
//               <input
//                 type="text"
//                 placeholder="Age Range"
//                 value={formData.age_range}
//                 onChange={(e) =>
//                   setFormData({ ...formData, age_range: e.target.value })
//                 }
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//               />
//               <input
//                 type="number"
//                 placeholder="Price"
//                 value={formData.price}
//                 onChange={(e) =>
//                   setFormData({ ...formData, price: e.target.value })
//                 }
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//               />
//               <input
//                 type="text"
//                 placeholder="Included Items (comma separated)"
//                 value={formData.included}
//                 onChange={(e) =>
//                   setFormData({ ...formData, included: e.target.value })
//                 }
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//               />
//               <input
//                 type="text"
//                 placeholder="Tutorial Link"
//                 value={formData.tutorial}
//                 onChange={(e) =>
//                   setFormData({ ...formData, tutorial: e.target.value })
//                 }
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//               />
//               <input
//                 type="text"
//                 placeholder="Activities (title::description | ...)"
//                 value={formData.activities}
//                 onChange={(e) =>
//                   setFormData({ ...formData, activities: e.target.value })
//                 }
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//               />
//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
//               />
//             </div>
//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="cursor-pointer rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//               >
//                 {editingProduct ? "Update" : "Add"}
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

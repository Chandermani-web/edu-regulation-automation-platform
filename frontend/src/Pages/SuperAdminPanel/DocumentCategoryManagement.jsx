import React, { useState } from "react";
import SuperAdminLayout from "../../Components/SuperAdminLayout";
import { PlusCircle, Trash2, Edit } from "lucide-react";

const DocumentCategoryManagement = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Registration Certificate",
      fileType: "PDF",
      maxSize: "5MB",
      required: true,
      assignedTo: "Institution",
    },
    {
      id: 2,
      name: "Faculty Report",
      fileType: "Excel",
      maxSize: "10MB",
      required: false,
      assignedTo: "UGC",
    },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    fileType: "PDF",
    maxSize: "5MB",
    required: false,
    assignedTo: "Institution",
  });

  // Handle Add Category
  const addCategory = () => {
    if (!newCategory.name.trim()) return alert("Category name is required!");

    setCategories([
      ...categories,
      { id: Date.now(), ...newCategory },
    ]);

    setNewCategory({
      name: "",
      fileType: "PDF",
      maxSize: "5MB",
      required: false,
      assignedTo: "Institution",
    });
  };

  // Handle Delete Category
  const deleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold">Document Category Management</h1>

        {/* ADD NEW CATEGORY FORM */}
        <div className="bg-white p-6 shadow rounded-xl space-y-5">
          <h2 className="text-xl font-semibold text-gray-700">
            Create New Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Category Name */}
            <div>
              <label className="font-medium">Category Name *</label>
              <input
                type="text"
                className="w-full border p-3 rounded-lg mt-1"
                placeholder="Ex: Registration Certificate"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>

            {/* File Type */}
            <div>
              <label className="font-medium">Allowed File Type</label>
              <select
                className="w-full border p-3 rounded-lg mt-1"
                value={newCategory.fileType}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, fileType: e.target.value })
                }
              >
                <option value="PDF">PDF</option>
                <option value="Image">Image (JPG/PNG)</option>
                <option value="Excel">Excel</option>
                <option value="Word">Word</option>
              </select>
            </div>

            {/* Max Size */}
            <div>
              <label className="font-medium">Max File Size</label>
              <select
                className="w-full border p-3 rounded-lg mt-1"
                value={newCategory.maxSize}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, maxSize: e.target.value })
                }
              >
                <option>2MB</option>
                <option>5MB</option>
                <option>10MB</option>
                <option>25MB</option>
              </select>
            </div>

            {/* Required / Optional */}
            <div>
              <label className="font-medium">Required?</label>
              <select
                className="w-full border p-3 rounded-lg mt-1"
                value={newCategory.required}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    required: e.target.value === "true",
                  })
                }
              >
                <option value="true">Yes, Required</option>
                <option value="false">No, Optional</option>
              </select>
            </div>

            {/* Assign To */}
            <div>
              <label className="font-medium">Assign To</label>
              <select
                className="w-full border p-3 rounded-lg mt-1"
                value={newCategory.assignedTo}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, assignedTo: e.target.value })
                }
              >
                <option value="Institution">Institution</option>
                <option value="UGC">UGC</option>
                <option value="AICTE">AICTE</option>
              </select>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={addCategory}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <PlusCircle size={20} /> Add Category
          </button>
        </div>

        {/* CATEGORY LIST TABLE */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Existing Categories
          </h2>

          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">File Type</th>
                <th className="p-3 border">Max Size</th>
                <th className="p-3 border">Required</th>
                <th className="p-3 border">Assigned To</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border">
                  <td className="p-3 border">{cat.name}</td>
                  <td className="p-3 border">{cat.fileType}</td>
                  <td className="p-3 border">{cat.maxSize}</td>
                  <td className="p-3 border">
                    {cat.required ? "Yes" : "No"}
                  </td>
                  <td className="p-3 border">{cat.assignedTo}</td>
                  <td className="p-3 border flex gap-3">
                    <Edit className="text-blue-600 cursor-pointer" />
                    <Trash2
                      className="text-red-600 cursor-pointer"
                      onClick={() => deleteCategory(cat.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default DocumentCategoryManagement;

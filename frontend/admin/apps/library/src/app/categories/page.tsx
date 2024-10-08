"use client";

import { useEffect, useState } from "react";
import { Category } from "../../utils/CategoryTypes";
import CategoryForm from "../../components/Categories/CategoryForm";
import Table from "@shared/components/Table";
import { createAPI } from "@shared/utils/common/api"; // Ensure this import is correct
import Loading from "@shared/components/Loading";

const $API_library = createAPI("http://localhost:8082/api");

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await $API_library.GET<Category[]>('book-categories');
    return response.data; // Directly return the data from the response
  } catch (error) {
    console.error(error);
    return []; // Return an empty array on error
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const [columns, setColumns] = useState([
    { label: "ID", field: "id" },
    { label: "Name (TH)", field: "nameTh" },
    { label: "Name (EN)", field: "nameEn" },
  ]);

  // Define a type for your row structure
  interface CategoryRow {
    id: string; // or number depending on your ID type
    nameTh: string;
    nameEn: string;
  }

  const [rows, setRows] = useState<CategoryRow[]>([]);

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      // Map categories to rows for the table
      const newRows = data.map((category) => ({
        id: category.id,
        nameTh: category.name.th,
        nameEn: category.name.en,
      }));
      setRows(newRows);
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this Category?")) {
      try {
        await $API_library.DELETE(`book-categories/${categoryId}`); // Use the API utility
        setCategories(categories.filter((category) => category.id !== categoryId));
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleFormSubmit = async (data: Category) => {
    try {
      const isUpdate = !!data.id;
      const method = isUpdate ? "PATCH" : "POST";
      const response = isUpdate
        ? await $API_library.PATCH<Category>(`book-categories/${data.id}`, data) // Use the API utility
        : await $API_library.POST<Category>('book-categories', data); // Use the API utility

      if (response) {
        const result = response.data; // Access the data field
        if (isUpdate) {
          setCategories(categories.map((c) => (c.id === result.id ? result : c)));
        } else {
          setCategories([...categories, result]);
        }
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Failed to submit category:", error);
    }
  };

  if (loading) {
    return <Loading/>;
  }

  return (
    <>
      <div>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Create New Book
        </button>
        {isFormOpen && (
          <CategoryForm
            category={editingCategory}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </div>

      <div>
        <Table columns={columns} rows={rows} />
      </div>
    </>
  );
}

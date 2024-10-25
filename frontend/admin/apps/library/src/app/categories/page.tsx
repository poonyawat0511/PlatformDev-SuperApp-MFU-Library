"use client";
import * as Icons from "@heroicons/react/24/outline";
import { useGlobalContext } from "@shared/context/GlobalContext";
import { tAlert, tAlertType } from "@shared/utils/types/Alert";
import { useEffect, useState } from "react";

import CategoryForm from "@/components/Categories/CategoryForm";
import CategoryTable from "@/components/Categories/CategoryTable";
import ConfirmDialog from "@/components/Categories/ConfirmDialog";
import { Category } from "@/utils/CategoryTypes";

const apiUrl = "http://localhost:8082/api/book-categories";

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function CategoriesPage() {
  const { addAlert } = useGlobalContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<Category | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [catetegoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddAlert = (
    iconName: keyof typeof Icons,
    title: string,
    message: string,
    type: tAlertType
  ) => {
    const newAlert: tAlert = {
      title: title,
      message: message,
      buttonText: "X",
      iconName: iconName,
      type: type,
      id: Math.random().toString(36).substring(2, 9),
    };
    addAlert(newAlert);
  };

  const handleCreate = () => {
    setSelectedCategories(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategories(category);
    setIsFormOpen(true);
  };

  const confirmDelete = (categoryId: string) => {
    setCategoryIdToDelete(categoryId);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!catetegoryIdToDelete) return;
  
    try {
      const response = await fetch(`${apiUrl}/${catetegoryIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete categories");
      }
      setCategories(categories.filter((t) => t.id !== catetegoryIdToDelete));
      handleAddAlert("ExclamationCircleIcon", "Success", "Category deleted successfully", tAlertType.SUCCESS);
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmDialogOpen(false);
      setCategoryIdToDelete(null);
    }
  };

  const handleFormSubmit = async (formData: Category) => {
    try {
      const method = formData.id ? "PATCH" : "POST";
      const url = apiUrl + (formData.id ? `/${formData.id}` : "");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${method === "POST" ? "create" : "update"} categories`
        );
      }

      const result = await response.json();
      if (method === "POST") {
        setCategories([...categories, result.data]);
      } else {
        setCategories(
          categories.map((t) => (t.id === result.data.id ? result.data : t))
        );
      }
      setIsFormOpen(false);
      handleAddAlert(
        "ExclamationCircleIcon",
        "Success",
        "Category updated successfully",
        tAlertType.SUCCESS
      );
      setSelectedCategories(null);
    } catch (error) {
      console.log(error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-4 border-b-2">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Categories
          </h1>
          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white mb-6"
          >
            New Categories
          </button>
        </div>
        <div className="flex flex-wrap justify-start">
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <CategoryForm
                category={selectedCategories}
                onSubmit={handleFormSubmit}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsConfirmDialogOpen(false)}
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
}

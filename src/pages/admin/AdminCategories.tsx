import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useUploadCategoryImage,
} from "@/hooks/admin/useAdminCategories";
import { CategoriesTable } from "@/components/admin/categories/CategoriesTable";
import type { Category } from "@/types/category";
import { CategoryFormModal, type CategoryFormValues } from "@/components/admin/categories/CategoriesFormModal";
import { useCategories } from "@/hooks/public/useCategories";

export default function AdminCategories() {
  const { data: categories, isLoading, isError } = useCategories();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const uploadImage = useUploadCategoryImage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleSubmit = (data: CategoryFormValues) => {
    const file = data.imageFile?.[0];

    if (editingCategory) {
      // Update name first, then upload image if a new one was selected
      updateCategory.mutate(
        { id: editingCategory.id, dto: { name: data.name} },
        {
          onSuccess: (updated) => {
            if (file) {
              uploadImage.mutate(
                { id: updated.id, file },
                { onSuccess: handleClose }
              );
            } else {
              handleClose();
            }
          },
        }
      );
    } else {
      // Create first, then upload image if provided
      createCategory.mutate(
        { name: data.name },
        {
          onSuccess: (created) => {
            if (file) {
              uploadImage.mutate(
                { id: created.id, file },
                { onSuccess: handleClose }
              );
            } else {
              handleClose();
            }
          },
        }
      );
    }
  };

  const isSubmitting =
    createCategory.isPending ||
    updateCategory.isPending ||
    uploadImage.isPending;

  return (
    <div className="mx-auto w-full max-w-384">
      <header className="mb-5 flex flex-col gap-4 border-b border-gray-700 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="mt-1 text-sm text-gray-400">
            {categories
              ? `${categories.length} ${categories.length === 1 ? "category" : "categories"}`
              : "Manage menu categories and images"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded bg-orange px-4 text-sm font-bold text-gray-950 transition hover:brightness-110"
        >
          <FiPlus aria-hidden="true" />
          Add category
        </button>
      </header>

      <CategoriesTable
        categories={categories ?? []}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryFormModal
        isOpen={isModalOpen}
        editingCategory={editingCategory}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

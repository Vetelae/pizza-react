import { useState } from "react";

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add Category
        </button>
      </div>

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
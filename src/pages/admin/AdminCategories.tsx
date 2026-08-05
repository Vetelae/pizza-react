import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { toast } from "sonner";

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
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminCategories() {
  const { data: categories, isLoading, isError } = useCategories();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const uploadImage = useUploadCategoryImage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

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

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    const category = categoryToDelete;
    deleteCategory.mutate(category.id, {
      onSuccess: () => {
        setCategoryToDelete(null);
        toast.success(`Category “${category.name}” deleted successfully.`);
      },
      onError: () => {
        toast.error(`Couldn’t delete category “${category.name}”. Please try again.`, {
          duration: 6000,
        });
      },
    });
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
                {
                  onSuccess: () => {
                    handleClose();
                    toast.success(`Category “${updated.name}” updated successfully.`);
                  },
                  onError: () => {
                    handleClose();
                    toast.warning(
                      `Category “${updated.name}” was saved, but the image upload failed. You can try again by editing it.`,
                      { duration: 6000 }
                    );
                  },
                }
              );
            } else {
              handleClose();
              toast.success(`Category “${updated.name}” updated successfully.`);
            }
          },
          onError: () => {
            toast.error("Couldn’t update the category. Please try again.", {
              duration: 6000,
            });
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
                {
                  onSuccess: () => {
                    handleClose();
                    toast.success(`Category “${created.name}” added successfully.`);
                  },
                  onError: () => {
                    handleClose();
                    toast.warning(
                      `Category “${created.name}” was saved, but the image upload failed. You can try again by editing it.`,
                      { duration: 6000 }
                    );
                  },
                }
              );
            } else {
              handleClose();
              toast.success(`Category “${created.name}” added successfully.`);
            }
          },
          onError: () => {
            toast.error("Couldn’t add the category. Please try again.", {
              duration: 6000,
            });
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
      <ConfirmDialog
        isOpen={categoryToDelete !== null}
        title="Delete category?"
        description={`Are you sure you want to delete “${categoryToDelete?.name ?? ""}”? This action cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        isPending={deleteCategory.isPending}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

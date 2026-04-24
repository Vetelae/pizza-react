import { useState } from "react";
import type { MenuItem } from "@/types/menuItem";
import { useMenuItems } from "@/hooks/public/useMenuItems";
import { useCategories } from "@/hooks/public/useCategories";

import {
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useUploadMenuItemImage,
} from "@/hooks/admin/useAdminMenuItems";
import { MenuItemsTable } from "@/components/admin/menuItems/MenuItemsTable";
import {
  MenuItemFormModal,
  type MenuItemFormValues,
} from "@/components/admin/menuItems/MenuItemFormModal";

export default function AdminMenuItems() {
  const { data: menuItems, isLoading, isError } = useMenuItems();
  const { data: categories = [] } = useCategories();

  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const uploadImage = useUploadMenuItemImage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  const handleAdd = () => {
    setEditingMenuItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingMenuItem(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItem.mutate(id);
    }
  };

  const handleSubmit = (data: MenuItemFormValues) => {
    const file = data.imageFile?.[0];

    const dto = {
      name: data.name,
      description: data.description || null,
      price: data.price,
      isAvailable: data.isAvailable,
      categoryId: data.categoryId,
    };

    if (editingMenuItem) {
      updateMenuItem.mutate(
        { id: editingMenuItem.id, dto },
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
      createMenuItem.mutate(
        { ...dto, imagePath: null, imageFileName: null },
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
    createMenuItem.isPending ||
    updateMenuItem.isPending ||
    uploadImage.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Menu Items</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add Menu Item
        </button>
      </div>
      <MenuItemsTable
        menuItems={menuItems ?? []}
        categories={categories}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <MenuItemFormModal
        isOpen={isModalOpen}
        editingMenuItem={editingMenuItem}
        categories={categories}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
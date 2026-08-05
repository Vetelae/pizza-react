import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { toast } from "sonner";
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
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminMenuItems() {
  const { data: menuItems, isLoading, isError } = useMenuItems();
  const { data: categories = [] } = useCategories();

  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const uploadImage = useUploadMenuItemImage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuItemToDelete, setMenuItemToDelete] = useState<MenuItem | null>(null);

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

  const handleDelete = (menuItem: MenuItem) => {
    setMenuItemToDelete(menuItem);
  };

  const handleConfirmDelete = () => {
    if (!menuItemToDelete) return;

    const menuItem = menuItemToDelete;
    deleteMenuItem.mutate(menuItem.id, {
      onSuccess: () => {
        setMenuItemToDelete(null);
        toast.success(`Menu item “${menuItem.name}” deleted successfully.`);
      },
      onError: () => {
        toast.error(`Couldn’t delete menu item “${menuItem.name}”. Please try again.`, {
          duration: 6000,
        });
      },
    });
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
                {
                  onSuccess: () => {
                    handleClose();
                    toast.success(`Menu item “${updated.name}” updated successfully.`);
                  },
                  onError: () => {
                    handleClose();
                    toast.warning(
                      `Menu item “${updated.name}” was saved, but the image upload failed. You can try again by editing it.`,
                      { duration: 6000 }
                    );
                  },
                }
              );
            } else {
              handleClose();
              toast.success(`Menu item “${updated.name}” updated successfully.`);
            }
          },
          onError: () => {
            toast.error("Couldn’t update the menu item. Please try again.", {
              duration: 6000,
            });
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
                {
                  onSuccess: () => {
                    handleClose();
                    toast.success(`Menu item “${created.name}” added successfully.`);
                  },
                  onError: () => {
                    handleClose();
                    toast.warning(
                      `Menu item “${created.name}” was saved, but the image upload failed. You can try again by editing it.`,
                      { duration: 6000 }
                    );
                  },
                }
              );
            } else {
              handleClose();
              toast.success(`Menu item “${created.name}” added successfully.`);
            }
          },
          onError: () => {
            toast.error("Couldn’t add the menu item. Please try again.", {
              duration: 6000,
            });
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
    <div className="mx-auto w-full max-w-384">
      <header className="mb-5 flex flex-col gap-4 border-b border-gray-700 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Menu items</h1>
          <p className="mt-1 text-sm text-gray-400">
            {menuItems
              ? `${menuItems.length} ${menuItems.length === 1 ? "menu item" : "menu items"}`
              : "Manage the menu, pricing and availability"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded bg-orange px-4 text-sm font-bold text-gray-950 transition hover:brightness-110"
        >
          <FiPlus aria-hidden="true" />
          Add menu item
        </button>
      </header>
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
      <ConfirmDialog
        isOpen={menuItemToDelete !== null}
        title="Delete menu item?"
        description={`Are you sure you want to delete “${menuItemToDelete?.name ?? ""}”? This action cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        isPending={deleteMenuItem.isPending}
        onCancel={() => setMenuItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { MenuItem } from "@/types/menuItem";
import type { Category } from "@/types/category";

interface MenuItemFormModalProps {
  isOpen: boolean;
  editingMenuItem: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: MenuItemFormValues) => void;
  isSubmitting: boolean;
}

export interface MenuItemFormValues {
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryId: number;
  imageFile?: FileList;
}

export function MenuItemFormModal({
  isOpen,
  editingMenuItem,
  categories,
  onClose,
  onSubmit,
  isSubmitting,
}: MenuItemFormModalProps) {
  const isEditMode = editingMenuItem !== null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MenuItemFormValues>();

  const imageFile = watch("imageFile");
  const previewUrl =
    imageFile && imageFile.length > 0
      ? URL.createObjectURL(imageFile[0])
      : null;

  useEffect(() => {
    if (isOpen) {
      reset(
        isEditMode
          ? {
              name: editingMenuItem.name,
              description: editingMenuItem.description ?? "",
              price: editingMenuItem.price,
              isAvailable: editingMenuItem.isAvailable,
              categoryId: editingMenuItem.categoryId,
            }
          : {
              name: "",
              description: "",
              price: 0,
              isAvailable: true,
              categoryId: categories[0]?.id,
            }
      );
    }
  }, [isOpen, editingMenuItem, isEditMode, reset, categories]);

  if (!isOpen) return null;

  const { ref: imageRef, ...imageRest } = register("imageFile");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Enter item name"
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 outline-none transition-colors
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.name ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Enter item description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 outline-none transition-colors
                focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (€)
            </label>
            <input
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be 0 or more" },
                valueAsNumber: true,
              })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 outline-none transition-colors
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.price ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register("categoryId", {
                required: "Category is required",
                valueAsNumber: true,
              })}
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 outline-none transition-colors
                focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white
                ${errors.categoryId ? "border-red-400" : "border-gray-300"}`}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Available toggle */}
          <div className="flex items-center gap-3">
            <input
              {...register("isAvailable")}
              type="checkbox"
              id="isAvailable"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isAvailable"
              className="text-sm font-medium text-gray-700"
            >
              Available
            </label>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image{" "}
              {isEditMode && (
                <span className="text-gray-400 font-normal">
                  (leave empty to keep current)
                </span>
              )}
            </label>

            {/* Current image in edit mode */}
            {isEditMode && editingMenuItem.imagePath && !previewUrl && (
              <img
                src={`${import.meta.env.VITE_BASE_URL}${editingMenuItem.imagePath}`}
                alt={editingMenuItem.name}
                className="mb-2 h-16 w-16 rounded object-cover border border-gray-200"
              />
            )}

            {/* New image preview */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mb-2 h-16 w-16 rounded object-cover border border-gray-200"
              />
            )}

            <input
              {...imageRest}
              ref={(e) => {
                imageRef(e);
                fileInputRef.current = e;
              }}
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3
                file:rounded file:border file:border-gray-300 file:text-xs file:font-medium
                file:text-gray-700 file:bg-white hover:file:bg-gray-50 transition-colors"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { Category } from "@/types/category";

interface CategoryFormModalProps {
  isOpen: boolean;
  editingCategory: Category | null;
  onClose: () => void;
  onSubmit: (data: CategoryFormValues) => void;
  isSubmitting: boolean;
}

export interface CategoryFormValues {
  name: string;
  imageFile?: FileList;
}

export function CategoryFormModal({
  isOpen,
  editingCategory,
  onClose,
  onSubmit,
  isSubmitting,
}: CategoryFormModalProps) {
  const isEditMode = editingCategory !== null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>();

  // Preview selected image
  const imageFile = watch("imageFile");
  const previewUrl =
    imageFile && imageFile.length > 0
      ? URL.createObjectURL(imageFile[0])
      : null;

  useEffect(() => {
    if (isOpen) {
      reset({ name: isEditMode ? editingCategory.name : "" });
    }
  }, [isOpen, editingCategory, isEditMode, reset]);

  if (!isOpen) return null;

  const { ref: imageRef, ...imageRest } = register("imageFile");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Category" : "Add Category"}
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
              placeholder="Enter category name"
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 outline-none transition-colors
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.name ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image {isEditMode && <span className="text-gray-400 font-normal">(leave empty to keep current)</span>}
            </label>

            {/* Current image in edit mode */}
            {isEditMode && editingCategory.imagePath && !previewUrl && (
              <img
                src={`${import.meta.env.VITE_BASE_URL}${editingCategory.imagePath}`}
                alt={editingCategory.name}
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
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
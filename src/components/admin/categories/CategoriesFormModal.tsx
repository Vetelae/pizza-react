import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
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

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { ref: imageRef, ...imageRest } = register("imageFile");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4 sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-md border border-gray-700 bg-gray-800 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-5 py-4 sm:px-6">
          <h2 id="category-form-title" className="text-lg font-bold text-white">
            {isEditMode ? "Edit Category" : "Add Category"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label="Close category form"
            title="Close"
          >
            <FiX size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-h-[calc(90vh-4.5rem)] space-y-4 overflow-y-auto px-5 py-5 sm:px-6"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="category-name"
              className="mb-1 block text-sm font-semibold text-gray-300"
            >
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              id="category-name"
              type="text"
              placeholder="Enter category name"
              autoFocus
              className={`w-full rounded border bg-gray-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange focus:ring-2 focus:ring-orange/30
                ${errors.name ? "border-red-500" : "border-gray-600"}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-300" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label
              htmlFor="category-image"
              className="mb-1 block text-sm font-semibold text-gray-300"
            >
              Image {isEditMode && <span className="font-normal text-gray-500">(leave empty to keep current)</span>}
            </label>

            {/* Current image in edit mode */}
            {isEditMode && editingCategory.imagePath && !previewUrl && (
              <img
                src={`${import.meta.env.VITE_BASE_URL}${editingCategory.imagePath}`}
                alt={editingCategory.name}
                className="mb-2 h-16 w-16 rounded border border-gray-600 object-cover"
              />
            )}

            {/* New image preview */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mb-2 h-16 w-16 rounded border border-gray-600 object-cover"
              />
            )}

            <input
              {...imageRest}
              ref={(e) => {
                imageRef(e);
                fileInputRef.current = e;
              }}
              id="category-image"
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-400 file:mr-3 file:rounded file:border file:border-gray-600 file:bg-gray-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-200 file:transition hover:file:bg-gray-600"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded border border-gray-600 px-4 text-sm font-semibold text-gray-200 transition hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded bg-orange px-4 text-sm font-bold text-gray-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { News } from "@/types/news";

interface NewsFormModalProps {
  isOpen: boolean;
  editingNews: News | null; // null = add mode, News = edit mode
  onClose: () => void;
  onSubmit: (data: NewsFormValues) => void;
  isSubmitting: boolean;
}

export interface NewsFormValues {
  title: string;
  content: string;
  date: string;
}

export function NewsFormModal({
  isOpen,
  editingNews,
  onClose,
  onSubmit,
  isSubmitting,
}: NewsFormModalProps) {
  const isEditMode = editingNews !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsFormValues>();

  // Populate form when opening in edit mode, clear when adding
  useEffect(() => {
    if (isOpen) {
      reset(
        isEditMode
          ? { title: editingNews.title, content: editingNews.content, date: editingNews.date }
          : { title: "", content: "", date: "" }
      );
    }
  }, [isOpen, editingNews, isEditMode, reset]);

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      {/* Modal panel */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()} // prevent backdrop click closing when clicking inside
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit News" : "Add News"}
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              type="text"
              placeholder="Enter news title"
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 outline-none transition-colors
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.title ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 outline-none transition-colors
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.date ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
            )}
        </div>
          

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              {...register("content", { required: "Content is required" })}
              rows={6}
              placeholder="Enter news content"
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 outline-none transition-colors resize-none
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.content ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
            )}
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
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
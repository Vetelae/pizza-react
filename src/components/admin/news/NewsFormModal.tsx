import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import type { News } from "@/types/news";
import { toDateInputValue } from "@/utils/formatters";

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
          ? {
              title: editingNews.title,
              content: editingNews.content,
              date: toDateInputValue(editingNews.date),
            }
          : { title: "", content: "", date: "" }
      );
    }
  }, [isOpen, editingNews, isEditMode, reset]);

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
        aria-labelledby="news-form-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-5 py-4 sm:px-6">
          <h2 id="news-form-title" className="text-lg font-bold text-white">
            {isEditMode ? "Edit News" : "Add News"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label="Close news form"
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
          {/* Title */}
          <div>
            <label
              htmlFor="news-title"
              className="mb-1 block text-sm font-semibold text-gray-300"
            >
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              id="news-title"
              type="text"
              placeholder="Enter news title"
              autoFocus
              className={`w-full rounded border bg-gray-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange focus:ring-2 focus:ring-orange/30
                ${errors.title ? "border-red-500" : "border-gray-600"}`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-300" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>
          {/* Date */}
          <div>
            <label
              htmlFor="news-date"
              className="mb-1 block text-sm font-semibold text-gray-300"
            >
              Date
            </label>
            <input
              {...register("date", { required: "Date is required" })}
              id="news-date"
              type="date"
              className={`w-full rounded border bg-gray-900 px-3 py-2 text-sm text-white outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30
                ${errors.date ? "border-red-500" : "border-gray-600"}`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-300" role="alert">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="news-content"
              className="mb-1 block text-sm font-semibold text-gray-300"
            >
              Content
            </label>
            <textarea
              {...register("content", { required: "Content is required" })}
              id="news-content"
              rows={6}
              placeholder="Enter news content"
              className={`w-full resize-none rounded border bg-gray-900 px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange focus:ring-2 focus:ring-orange/30
                ${errors.content ? "border-red-500" : "border-gray-600"}`}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-300" role="alert">
                {errors.content.message}
              </p>
            )}
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
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

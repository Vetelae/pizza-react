import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useCreateNews, useDeleteNews, useUpdateNews } from "@/hooks/admin/useAdminNews";
import { useNews } from "@/hooks/public/useNews";
import { NewsTable } from "@/components/admin/news/NewsTable";
import { NewsFormModal } from "@/components/admin/news/NewsFormModal";
import type { NewsFormValues } from "@/components/admin/news/NewsFormModal";
import type { News } from "@/types/news";

export default function AdminNews() {
  const { data: news, isLoading, isError } = useNews();

  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const handleAdd = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleEdit = (news: News) => {
    setEditingNews(news);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const handleDelete = (id: number) => {
  if (window.confirm("Are you sure you want to delete this news article?")) {
    deleteNews.mutate(id);
  }
};

const handleSubmit = (data: NewsFormValues) => {
  const payload = {
    ...data,
    date: new Date(data.date).toISOString(), // converts "2026-04-03" to "2026-04-03T00:00:00.000Z"
  };

  if (editingNews) {
    updateNews.mutate(
      { id: editingNews.id, dto: payload },
      { onSuccess: handleClose }
    );
  } else {
    createNews.mutate(payload, { onSuccess: handleClose });
  }
};

  return (
    <div className="mx-auto w-full max-w-384">
      <header className="mb-5 flex flex-col gap-4 border-b border-gray-700 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">News</h1>
          <p className="mt-1 text-sm text-gray-400">
            {news
              ? `${news.length} ${news.length === 1 ? "article" : "articles"}`
              : "Manage customer-facing news articles"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded bg-orange px-4 text-sm font-bold text-gray-950 transition hover:brightness-110"
        >
          <FiPlus aria-hidden="true" />
          Add news
        </button>
      </header>

      <NewsTable
        news={news ?? []}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <NewsFormModal
        isOpen={isModalOpen}
        editingNews={editingNews}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isSubmitting={createNews.isPending || updateNews.isPending}
      />
    </div>
  );
}

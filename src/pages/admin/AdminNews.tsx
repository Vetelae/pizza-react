import { useState } from "react";
import { useNews } from "@/hooks/useNews";
import { useCreateNews, useDeleteNews, useUpdateNews } from "@/hooks/admin/useAdminNews";
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">News</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add News
        </button>
      </div>

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
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import { useCreateNews, useDeleteNews, useUpdateNews } from "@/hooks/admin/useAdminNews";
import { useNews } from "@/hooks/public/useNews";
import { NewsTable } from "@/components/admin/news/NewsTable";
import { NewsFormModal } from "@/components/admin/news/NewsFormModal";
import type { NewsFormValues } from "@/components/admin/news/NewsFormModal";
import type { News } from "@/types/news";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminNews() {
  const { data: news, isLoading, isError } = useNews();

  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);

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

  const handleDelete = (newsArticle: News) => {
    setNewsToDelete(newsArticle);
  };

  const handleConfirmDelete = () => {
    if (!newsToDelete) return;

    const newsArticle = newsToDelete;
    deleteNews.mutate(newsArticle.id, {
      onSuccess: () => {
        setNewsToDelete(null);
        toast.success(`News article “${newsArticle.title}” deleted successfully.`);
      },
      onError: () => {
        toast.error(`Couldn’t delete news article “${newsArticle.title}”. Please try again.`, {
          duration: 6000,
        });
      },
    });
  };

const handleSubmit = (data: NewsFormValues) => {
  const payload = {
    ...data,
    date: new Date(data.date).toISOString(), // converts "2026-04-03" to "2026-04-03T00:00:00.000Z"
  };

  if (editingNews) {
    updateNews.mutate(
      { id: editingNews.id, dto: payload },
      {
        onSuccess: (updated) => {
          handleClose();
          toast.success(`News article “${updated.title}” updated successfully.`);
        },
        onError: () => {
          toast.error("Couldn’t update the news article. Please try again.", {
            duration: 6000,
          });
        },
      }
    );
  } else {
    createNews.mutate(payload, {
      onSuccess: (created) => {
        handleClose();
        toast.success(`News article “${created.title}” added successfully.`);
      },
      onError: () => {
        toast.error("Couldn’t add the news article. Please try again.", {
          duration: 6000,
        });
      },
    });
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
      <ConfirmDialog
        isOpen={newsToDelete !== null}
        title="Delete news article?"
        description={`Are you sure you want to delete “${newsToDelete?.title ?? ""}”? This action cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        isPending={deleteNews.isPending}
        onCancel={() => setNewsToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

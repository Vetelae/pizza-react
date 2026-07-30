import type { News } from "@/types/news";
import { formatDate } from "@/utils/formatters";

interface NewsTableProps {
  news: News[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (news: News) => void;
  onDelete: (id: number) => void;
}

interface NewsRowProps {
  news: News;
  onEdit: (news: News) => void;
  onDelete: (id: number) => void;
}

export function NewsTable({
  news,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: NewsTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <div
        className="border border-red-800 bg-gray-800 px-5 py-10 text-center text-sm text-red-300"
        role="alert"
      >
        Failed to load news. Please try again.
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="border border-dashed border-gray-700 bg-gray-800/70 px-5 py-10 text-center text-sm text-gray-400">
        No news articles yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-700 bg-gray-800">
      <table className="min-w-full divide-y divide-gray-700 text-sm">
        <thead className="bg-gray-900/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Date
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-gray-800">
          {news.map((item) => (
            <NewsRow
              key={item.id}
              news={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewsRow({ news, onEdit, onDelete }: NewsRowProps) {
  return (
    <tr className="transition-colors hover:bg-gray-700/50">
      <td className="max-w-xs truncate px-4 py-3 font-semibold text-white">
        {news.title}
      </td>
      <td className="px-4 py-3 text-gray-300">
        {formatDate(news.date)}
      </td>
      <td className="space-x-2 whitespace-nowrap px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onEdit(news)}
          className="rounded border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-700 hover:text-white"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(news.id)}
          className="rounded border border-red-800 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-950/40"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-md border border-gray-700"
      aria-label="Loading news"
      aria-busy="true"
    >
      <div className="h-10 bg-gray-900/60" />
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex h-14 items-center gap-4 border-t border-gray-700 bg-gray-800 px-4"
        >
          <div className="h-3 w-1/3 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-1/6 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-1/8 animate-pulse rounded bg-gray-700" />
        </div>
      ))}
      <span className="sr-only">Loading news</span>
    </div>
  );
}

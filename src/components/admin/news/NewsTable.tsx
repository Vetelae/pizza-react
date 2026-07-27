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
      <div className="py-10 text-center text-sm text-red-500">
        Failed to load news. Please try again.
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        No news articles yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
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
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
        {news.title}
      </td>
      <td className="px-4 py-3 text-gray-500">
        {formatDate(news.date)}
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        <button
          onClick={() => onEdit(news)}
          className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(news.id)}
          className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 h-10" />
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-12 border-t border-gray-100 bg-white flex items-center px-4 gap-4"
        >
          <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/6 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/8 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

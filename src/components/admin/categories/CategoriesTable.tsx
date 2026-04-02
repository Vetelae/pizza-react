import type { Category } from "@/types/category";

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

interface CategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoriesTable({
  categories,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (isLoading) return <TableSkeleton />;

  if (isError) {
    return (
      <div className="py-10 text-center text-sm text-red-500">
        Failed to load categories. Please try again.
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        No categories yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-medium text-gray-900">{category.name}</td>
      <td className="px-4 py-3">
        {category.imagePath ? (
          <img
            src={`${import.meta.env.VITE_BASE_URL}${category.imagePath}`}
            alt={category.name}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            None
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        <button
          onClick={() => onEdit(category)}
          className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category.id)}
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
          <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/8 animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  );
}
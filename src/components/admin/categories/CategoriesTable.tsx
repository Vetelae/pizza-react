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
      <div
        className="border border-red-800 bg-gray-800 px-5 py-10 text-center text-sm text-red-300"
        role="alert"
      >
        Failed to load categories. Please try again.
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="border border-dashed border-gray-700 bg-gray-800/70 px-5 py-10 text-center text-sm text-gray-400">
        No categories yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-700 bg-gray-800">
      <table className="min-w-full divide-y divide-gray-700 text-sm">
        <thead className="bg-gray-900/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Image
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-gray-800">
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
    <tr className="transition-colors hover:bg-gray-700/50">
      <td className="px-4 py-3 font-semibold text-white">{category.name}</td>
      <td className="px-4 py-3">
        {category.imagePath ? (
          <img
            src={`${import.meta.env.VITE_BASE_URL}${category.imagePath}`}
            alt={category.name}
            className="h-10 w-10 rounded border border-gray-600 object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-700 text-xs text-gray-400">
            None
          </div>
        )}
      </td>
      <td className="space-x-2 whitespace-nowrap px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="rounded border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-700 hover:text-white"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(category.id)}
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
      aria-label="Loading categories"
      aria-busy="true"
    >
      <div className="h-10 bg-gray-900/60" />
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex h-14 items-center gap-4 border-t border-gray-700 bg-gray-800 px-4"
        >
          <div className="h-3 w-1/4 animate-pulse rounded bg-gray-700" />
          <div className="h-8 w-8 animate-pulse rounded bg-gray-700" />
          <div className="ml-auto h-3 w-1/8 animate-pulse rounded bg-gray-700" />
        </div>
      ))}
      <span className="sr-only">Loading categories</span>
    </div>
  );
}

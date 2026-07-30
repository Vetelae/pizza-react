import type { MenuItem } from "@/types/menuItem";
import type { Category } from "@/types/category";
import { formatCurrency } from "@/utils/formatters";

interface MenuItemsTableProps {
  menuItems: MenuItem[];
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (menuItem: MenuItem) => void;
  onDelete: (id: number) => void;
}

interface MenuItemRowProps {
  menuItem: MenuItem;
  categories: Category[];
  onEdit: (menuItem: MenuItem) => void;
  onDelete: (id: number) => void;
}

export function MenuItemsTable({
  menuItems,
  categories,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: MenuItemsTableProps) {
  if (isLoading) return <TableSkeleton />;

  if (isError) {
    return (
      <div
        className="border border-red-800 bg-gray-800 px-5 py-10 text-center text-sm text-red-300"
        role="alert"
      >
        Failed to load menu items. Please try again.
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="border border-dashed border-gray-700 bg-gray-800/70 px-5 py-10 text-center text-sm text-gray-400">
        No menu items yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-700 bg-gray-800">
      <table className="min-w-full divide-y divide-gray-700 text-sm">
        <thead className="bg-gray-900/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Image
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
              Available
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-gray-800">
          {menuItems.map((item) => (
            <MenuItemRow
              key={item.id}
              menuItem={item}
              categories={categories}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MenuItemRow({ menuItem, categories, onEdit, onDelete }: MenuItemRowProps) {
  const categoryName =
    menuItem.category?.name ??
    categories.find((c) => c.id === menuItem.categoryId)?.name ??
    "—";

  return (
    <tr className="transition-colors hover:bg-gray-700/50">
      <td className="px-4 py-3">
        {menuItem.imagePath ? (
          <img
            src={`${import.meta.env.VITE_BASE_URL}${menuItem.imagePath}`}
            alt={menuItem.name}
            className="h-10 w-10 rounded border border-gray-600 object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-700 text-xs text-gray-400">
            None
          </div>
        )}
      </td>
      <td className="px-4 py-3 font-semibold text-white">
        <div>{menuItem.name}</div>
        {menuItem.description && (
          <div className="max-w-48 truncate text-xs font-normal text-gray-400">
            {menuItem.description}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-gray-300">{categoryName}</td>
      <td className="px-4 py-3 font-medium text-white">{formatCurrency(menuItem.price)}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${
            menuItem.isAvailable
              ? "bg-emerald-950/60 text-emerald-300"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          {menuItem.isAvailable ? "Yes" : "No"}
        </span>
      </td>
      <td className="space-x-2 whitespace-nowrap px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onEdit(menuItem)}
          className="rounded border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:border-gray-500 hover:bg-gray-700 hover:text-white"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(menuItem.id)}
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
      aria-label="Loading menu items"
      aria-busy="true"
    >
      <div className="h-10 bg-gray-900/60" />
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex h-14 items-center gap-4 border-t border-gray-700 bg-gray-800 px-4"
        >
          <div className="h-10 w-10 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-1/4 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-1/6 animate-pulse rounded bg-gray-700" />
          <div className="h-3 w-12 animate-pulse rounded bg-gray-700" />
          <div className="ml-auto h-5 w-10 animate-pulse rounded bg-gray-700" />
        </div>
      ))}
      <span className="sr-only">Loading menu items</span>
    </div>
  );
}

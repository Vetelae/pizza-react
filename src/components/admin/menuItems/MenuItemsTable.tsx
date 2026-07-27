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
      <div className="py-10 text-center text-sm text-red-500">
        Failed to load menu items. Please try again.
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        No menu items yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Available
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
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
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        {menuItem.imagePath ? (
          <img
            src={`${import.meta.env.VITE_BASE_URL}${menuItem.imagePath}`}
            alt={menuItem.name}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            None
          </div>
        )}
      </td>
      <td className="px-4 py-3 font-medium text-gray-900">
        <div>{menuItem.name}</div>
        {menuItem.description && (
          <div className="text-xs text-gray-400 truncate max-w-48">
            {menuItem.description}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-gray-600">{categoryName}</td>
      <td className="px-4 py-3 text-gray-900">{formatCurrency(menuItem.price)}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            menuItem.isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {menuItem.isAvailable ? "Yes" : "No"}
        </span>
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        <button
          onClick={() => onEdit(menuItem)}
          className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(menuItem.id)}
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
          className="h-14 border-t border-gray-100 bg-white flex items-center px-4 gap-4"
        >
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/6 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-10 animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  );
}

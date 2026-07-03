import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { MenuItem } from "@/types/menuItem";
import { useAddCartItem } from "@/hooks/public/useCart";

interface CartModalProps {
  isOpen: boolean;
  menuItem: MenuItem | null;
  onClose: () => void;
}

export interface CartFormValues {
  quantity: number;
}

export function CartModal({ isOpen, menuItem, onClose }: CartModalProps) {
  const addCartItem = useAddCartItem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CartFormValues>({ defaultValues: { quantity: 1 } });

  useEffect(() => {
    if (isOpen) reset({ quantity: 1 });
  }, [isOpen, reset]);

  if (!isOpen || !menuItem) return null;

  const onSubmit = async (data: CartFormValues) => {
    await addCartItem.mutateAsync({
      menuItemId: menuItem.id,
      quantity: data.quantity,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{menuItem.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Price display */}
          <p className="text-sm text-gray-500">
            Price: <span className="font-semibold text-gray-900">${menuItem.price.toFixed(2)}</span>
          </p>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Minimum quantity is 1" },
                max: { value: 99, message: "Maximum quantity is 99" },
                valueAsNumber: true,
              })}
              type="number"
              className={`w-full px-3 py-2 border rounded-md text-sm text-gray-900 outline-none transition-colors
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.quantity ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addCartItem.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {addCartItem.isPending ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
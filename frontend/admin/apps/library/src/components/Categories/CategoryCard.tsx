import { Category } from "@/utils/CategoryTypes";


interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <div className="max-w-sm w-full h-85 rounded overflow-hidden shadow-lg m-2">
      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-1">{category.name.th}</div>
        <p className="text-gray-700 text-sm">{category.name.en}</p>
      </div>
      <div className="px-4 pt-2 pb-2"></div>
      <div className="flex justify-between px-4 py-2">
        <button
          onClick={() => onEdit(category)}
          className="bg-yellow-500 text-white px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

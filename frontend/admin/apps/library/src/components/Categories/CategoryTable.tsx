import { Category } from "@/utils/CategoryTypes";
import { BsTrashFill } from "react-icons/bs";
import { LiaPenFancySolid } from "react-icons/lia";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (categories: Category) => void;
  onDelete: (categoriesId: string) => void;
}

export default function TimeslotTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-center">Start</th>
            <th className="px-6 py-3 text-center">End</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {categories.map((category) => {
            const EN = category.name.en || "No Data";
            const TH = category.name.th|| "No Data";

            return (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{EN}</td>
                <td className="px-6 py-4 text-center">{TH}</td>
                <td className="px-6 py-4 flex space-x-2 text-center justify-center">
                  <button
                    onClick={() => onEdit(category)}
                    className="bg-white text-black px-2 py-2 rounded-full border border-gray"
                  >
                    <LiaPenFancySolid className="size-5" />
                  </button>
                  <button
                    onClick={() => category.id && onDelete(category.id)}
                    className="bg-black text-white px-2 py-2 rounded-full border border-gray"
                  >
                    <BsTrashFill className="size-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

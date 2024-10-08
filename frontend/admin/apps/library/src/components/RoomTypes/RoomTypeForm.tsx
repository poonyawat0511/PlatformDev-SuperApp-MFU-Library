import { RoomType } from "@/utils/RoomtypeTypes";
import { useEffect, useState } from "react";

interface RoomTypeFormProps {
  roomTyepe?: RoomType | null;
  onSubmit: (data: RoomType) => void;
  onClose: () => void;
}

export default function RoomtypeForm({
  roomTyepe,
  onSubmit,
  onClose,
}: RoomTypeFormProps) {
  const [nameTh, setNameTh] = useState<string>("");
  const [nameEn, setNameEn] = useState<string>("");

  useEffect(() => {
    if (roomTyepe) {
      setNameTh(roomTyepe.name.th);
      setNameEn(roomTyepe.name.en);
    }
  }, [roomTyepe]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: RoomType = {
      id: roomTyepe?.id || "",
      name: {
        th: nameTh,
        en: nameEn,
      },
    };

    onSubmit(data);
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {roomTyepe ? "Edit RoomType" : "Create RoomType"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name (TH)
            </label>
            <input
              type="text"
              value={nameTh}
              onChange={(e) => setNameTh(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name (EN)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {roomTyepe ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

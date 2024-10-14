import { Book } from "@/utils/BookTypes";
import { Category, LanguageString } from "@/utils/CategoryTypes";
import Modal from "@shared/components/Modal";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@shared/context/GlobalContext";
import * as Icons from "@heroicons/react/24/outline";
import { tAlertType } from "@shared/utils/types/Alert";
import { GrFormClose } from "react-icons/gr";
import { LiaCheckCircle } from "react-icons/lia";
interface BookFormProps {
  book?: Book | null;
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
}

export default function BookForm({ book, onSubmit, onClose }: BookFormProps) {
  const { addAlert } = useGlobalContext();
  const [name, setName] = useState<LanguageString>({
    en: book?.name?.en || "",
    th: book?.name?.th || "",
  });
  const [description, setDescription] = useState<LanguageString>({
    en: book?.description?.en || "",
    th: book?.description?.th || "",
  });
  const [ISBN, setISBN] = useState<string>(book?.ISBN || "");
  const [bookImage, setBookImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    book?.bookImage || null
  );
  const [category, setCategory] = useState<string>(book?.category?.id || "");
  const [status, setStatus] = useState<string>(book?.status || "ready");
  const [quantity, setQuantity] = useState<number>(book?.quantity || 0);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          "http://localhost:8082/api/book-categories"
        );
        const result = await response.json();
        console.log("Fetched categories:", result.data);
        setCategories(result.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (book) {
      setName({
        en: book.name?.en || "",
        th: book.name?.th || "",
      });
      setDescription({
        en: book.description?.en || "",
        th: book.description?.th || "",
      });
      setISBN(book.ISBN || "");
      setImagePreview(book.bookImage || null);
      setCategory(book.category?.id || "");
      setStatus(book.status || "ready");
      setQuantity(book.quantity || 1);
    }
  }, [book]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBookImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected category ID:", e.target.value);
    setCategory(e.target.value);
  };

  const handleSubmit = () => {
    const formData = new FormData();

    if (book?.id) {
      formData.append("id", book.id);
    }

    formData.append("name[th]", name.th);
    formData.append("name[en]", name.en);
    formData.append("description[th]", description.th);
    formData.append("description[en]", description.en);
    // Validation logic and alerts
    if (ISBN) {
      formData.append("ISBN", ISBN);
    } else {
      addAlert({
        title: "No ISBN",
        message: "Please enter the ISBN number",
        buttonText: "X",
        iconName: "XCircleIcon" as keyof typeof Icons,
        type: tAlertType.ERROR,
      });
    }

    if (category) {
      formData.append("category", category);
    } else {
      addAlert({
        title: "Category Missing",
        message: "Please select a category",
        buttonText: "X",
        iconName: "ExclamationCircleIcon" as keyof typeof Icons,
        type: tAlertType.WARNING,
      });
      return;
    }

    if (["ready", "not ready"].includes(status)) {
      formData.append("status", status);
    } else {
      addAlert({
        title: "Invalid Status",
        message: "The status value is invalid",
        buttonText: "X",
        iconName: "ExclamationCircleIcon" as keyof typeof Icons,
        type: tAlertType.WARNING,
      });
      return;
    }
    if (quantity) {
      formData.append("quantity", quantity.toString());
    } else {
      addAlert({
        title: "No quantity",
        message: "plaese fill quantity for Book minimum 0",
        buttonText: "X",
        iconName: "PhotographIcon" as keyof typeof Icons,
        type: tAlertType.WARNING,
      });
    }

    if (bookImage) {
      formData.append("bookImage", bookImage);
    } else {
      addAlert({
        title: "No Image",
        message: "Please upload a book image",
        buttonText: "X",
        iconName: "PhotographIcon" as keyof typeof Icons,
        type: tAlertType.WARNING,
      });
    }

    console.log(
      "Submitting form data:",
      Object.fromEntries(formData.entries())
    );

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={true}
      title={book ? "Edit Form" : "Create Form"}
      onClose={onClose}
      actions={
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-2 py-2 rounded-full"
          >
            <LiaCheckCircle className="size-6" />
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-2 py-2 rounded-full ml-6"
          >
            <GrFormClose className="size-6" />
          </button>
        </div>
      }
    >
      <div className="border-t-2 border-gray-300 pb-2 mb-4">
        <div className="mt-4">
          {imagePreview && (
            <div className="mb-4">
              <img
                src={imagePreview}
                alt="Book preview"
                className="w-full h-40 object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 mb-2 w-full rounded-full"
          />
          <input
            type="text"
            placeholder="Name (EN)"
            value={name.en}
            onChange={(e) => setName({ ...name, en: e.target.value })}
            className="border p-2 mb-2 w-full rounded-full"
          />
          <input
            type="text"
            placeholder="Name (TH)"
            value={name.th}
            onChange={(e) => setName({ ...name, th: e.target.value })}
            className="border p-2 mb-2 w-full rounded-full"
          />
          <input
            type="text"
            placeholder="Description (EN)"
            value={description.en}
            onChange={(e) =>
              setDescription({ ...description, en: e.target.value })
            }
            className="border p-2 mb-2 w-full rounded-full"
          />
          <input
            type="text"
            placeholder="Description (TH)"
            value={description.th}
            onChange={(e) =>
              setDescription({ ...description, th: e.target.value })
            }
            className="border p-2 mb-2 w-full rounded-full"
          />
          <input
            type="text"
            placeholder="ISBN"
            value={ISBN}
            onChange={(e) => setISBN(e.target.value)}
            className="border p-2 mb-2 w-full rounded-full"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="border p-2 mb-2 w-full rounded-full"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.en}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 mb-2 w-full rounded-full"
          >
            <option value="ready">Ready</option>
            <option value="not ready">Not Ready</option>
          </select>

          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="border p-2 mb-4 w-full rounded-full"
          />
        </div>
      </div>
    </Modal>
  );
}

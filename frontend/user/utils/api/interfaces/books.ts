import { Category, LanguageString } from "./categories";

export interface Books{
    id:string;
    name: LanguageString;
    description: LanguageString;
    ISBN:string;
    bookImage: string;
    category: Category;
    status: string;
    quantity: number;
}
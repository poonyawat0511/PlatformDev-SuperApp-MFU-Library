import { Module } from "@nestjs/common";
import { BookCategoriesService } from "./book-categories.service";
import { BookCategoriesController } from "./book-categories.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
  BookCategory,
  BookCategorySchema,
} from "./schemas/book-category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookCategory.name, schema: BookCategorySchema },
    ]),
  ],
  controllers: [BookCategoriesController],
  providers: [BookCategoriesService],
})
export class BookCategoriesModule {}

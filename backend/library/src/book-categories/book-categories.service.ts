import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBookCategoryDto } from "./dto/create-book-category.dto";
import { UpdateBookCategoryDto } from "./dto/update-book-category.dto";
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from "src/app/common/utils/error.util";
import { InjectModel } from "@nestjs/mongoose";
import { BookCategory } from "./schemas/book-category.schema";
import { Model } from "mongoose";

@Injectable()
export class BookCategoriesService {
  private readonly errorBuilder = new ErrorBuilder("Book-Categories");

  constructor(
    @InjectModel(BookCategory.name)
    private readonly bookCategoryModel: Model<BookCategory>
  ) {}

  async create(
    createBookCategoryDto: CreateBookCategoryDto
  ): Promise<BookCategory> {
    try {
      const bookCategoryDoc = new this.bookCategoryModel(createBookCategoryDto);
      const bookCategory = await bookCategoryDoc.save();
      return bookCategory.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          })
        );
      }
    }
  }

  async findAll(): Promise<BookCategory[]> {
    const bookCategory = await this.bookCategoryModel.find().lean();
    return bookCategory;
  }

  async findOne(id: string): Promise<BookCategory> {
    try {
      const bookCategory = await this.bookCategoryModel.findById(id).lean();
      if (!bookCategory) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return bookCategory;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateBookCategoryDto: UpdateBookCategoryDto
  ): Promise<BookCategory> {
    const exists = await this.bookCategoryModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const bookCategory = await this.bookCategoryModel
        .findByIdAndUpdate(id, updateBookCategoryDto, options)
        .lean();
      return bookCategory;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.update,
          })
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<BookCategory> {
    const bookCategory = await this.bookCategoryModel
      .findByIdAndDelete(id)
      .lean();
    if (!bookCategory) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return bookCategory;
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
  Req,
} from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Book } from "./schemas/book.schema";
import { Model } from "mongoose";
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from "src/app/common/utils/error.util";

@Injectable()
export class BooksService {
  private readonly errorBuilder = new ErrorBuilder("Books");
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const bookDoc = new this.bookModel(createBookDto);
      const book = await bookDoc.save();
      return book.toObject();
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

  async findAll(): Promise<Book[]> {
    const book = await this.bookModel.find().lean();
    return book;
  }

  async findOne(id: string): Promise<Book> {
    try {
      const book = await this.bookModel.findById(id).lean();
      if (!book) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return book;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const exists = await this.bookModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const book = await this.bookModel
        .findByIdAndUpdate(id, updateBookDto, options)
        .lean();
      return book;
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

  async remove(id: string): Promise<Book> {
    const book = await this.bookModel.findByIdAndDelete(id).lean();
    if (!book) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return book;
  }
}

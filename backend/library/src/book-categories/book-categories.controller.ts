import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from "@nestjs/common";
import { BookCategoriesService } from "./book-categories.service";
import { CreateBookCategoryDto } from "./dto/create-book-category.dto";
import { UpdateBookCategoryDto } from "./dto/update-book-category.dto";
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from "src/app/common/utils/response.util";
import { BookCategoryEntity } from "./entities/book-category.entity";

@Controller("book-categories")
export class BookCategoriesController {
  private readonly messageBuilder = new MessageBuilder("BookCategories");

  constructor(private readonly bookCategoriesService: BookCategoriesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createBookCategoryDto: CreateBookCategoryDto) {
    const bookCategory = await this.bookCategoriesService.create(
      createBookCategoryDto
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new BookCategoryEntity(bookCategory)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const bookCategories = await this.bookCategoriesService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      bookCategories.map((bookCategory) => new BookCategoryEntity(bookCategory))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const BookCategory = await this.bookCategoriesService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new BookCategoryEntity(BookCategory)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateBookCategoryDto: UpdateBookCategoryDto
  ) {
    const bookCategory = await this.bookCategoriesService.update(
      id,
      updateBookCategoryDto
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new BookCategoryEntity(bookCategory)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const bookCategory = await this.bookCategoriesService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new BookCategoryEntity(bookCategory)
    );
  }
}

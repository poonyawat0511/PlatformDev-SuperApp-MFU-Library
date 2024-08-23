import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from "src/app/common/utils/response.util";
import { storageConfig } from "src/app/config/storage.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseDto } from "src/app/common/dto/response.dto";
import { BookEntity } from "./entities/book.entity";

const bookImageUploadInterCepters = FileInterceptor("bookImage", {
  storage: storageConfig,
});

@Controller("books")
export class BooksController {
  private readonly messageBuilder = new MessageBuilder("Books");
  constructor(private readonly booksService: BooksService) {}

  @UseInterceptors(ClassSerializerInterceptor, bookImageUploadInterCepters)
  @Post()
  async create(
    @Body() createBookDto: CreateBookDto,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: "jpeg|png" })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ): Promise<ResponseDto<any>> {
    const bookImage = file?.filename;

    const book = await this.booksService.create({
      ...createBookDto,
      bookImage,
    });
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new BookEntity(book)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const books = await this.booksService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      books.map((book) => new BookEntity(book))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const book = await this.booksService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new BookEntity(book)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor, bookImageUploadInterCepters)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateBookDto: UpdateBookDto,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: "jpeg|png" })
        .addMaxSizeValidator({ maxSize: 255 * 1024 }) // 255 KB limit
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ): Promise<any> {
    const bookImage = file?.filename;
    const dtoWithPhoto = { ...updateBookDto, bookImage };
    const book = await this.booksService.update(id, dtoWithPhoto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new BookEntity(book)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string):Promise <any> {
    const book = await this.booksService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new BookEntity(book)
    );
  }
}

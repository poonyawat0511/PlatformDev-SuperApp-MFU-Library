import { PartialType } from '@nestjs/swagger';
import { CreateBookCategoryDto } from './create-book-category.dto';

export class UpdateBookCategoryDto extends PartialType(CreateBookCategoryDto) {}

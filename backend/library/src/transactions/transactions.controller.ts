import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from "src/app/common/utils/response.util";
import { TransactionEntity } from "./entities/transaction.entity";

@Controller("transactions")
export class TransactionsController {
  private readonly messageBuilder = new MessageBuilder("Transactions");

  constructor(private readonly transactionsService: TransactionsService) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Query("includes") includes?: string | string[]
  ) {
    const transaction = await this.transactionsService.create(
      createTransactionDto,
      { includes }
    );
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new TransactionEntity(transaction)
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const transactions = await this.transactionsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      transactions.map((transaction) => new TransactionEntity(transaction))
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const transaction = await this.transactionsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new TransactionEntity(transaction)
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Query("includes") includes?: string | string[]
  ) {
    const transaction = await this.transactionsService.update(
      id,
      updateTransactionDto,
      { includes }
    );
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new TransactionEntity(transaction)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const transaction = await this.transactionsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new TransactionEntity(transaction)
    );
  }
}

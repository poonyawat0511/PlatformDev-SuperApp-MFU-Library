import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Transaction } from "./schemas/transaction.schema";
import { Model } from "mongoose";
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from "src/app/common/utils/error.util";

@Injectable()
export class TransactionsService {
  private readonly errorBuilder = new ErrorBuilder("Transactions");

  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    try {
      const transactionDoc = new this.transactionModel(createTransactionDto);
      const transaction = await transactionDoc.save();
      return transaction.toObject();
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

  async findAll(): Promise<Transaction[]> {
    const transaction = await this.transactionModel.find().lean();
    return transaction;
  }

  async findOne(id: string): Promise<Transaction> {
    try {
      const transaction = await this.transactionModel.findById(id).lean();
      if (!transaction) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto
  ): Promise<Transaction> {
    const exists = await this.transactionModel.exists({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const transaction = await this.transactionModel
        .findByIdAndUpdate(id, updateTransactionDto, options)
        .lean();
      return transaction;
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

  async remove(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findByIdAndDelete(id)
      .lean();
    if (!transaction) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return transaction;
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ErrorBuilder, ErrorMethod } from "src/app/common/utils/error.util";
import { BookStatus } from "src/books/enums/book-status.enum";
import { Book } from "src/books/schemas/book.schema";
import { User } from "src/users/schemas/user.schema";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { TransactionsType } from "./enums/transactions-type.enum";
import { Transaction } from "./schemas/transaction.schema";

const POPULATE_PIPE = [
  {
    path: "book",
    select: ["name.en", "bookImage", "category", "name.th", "ISBN"],
    populate: {
      path: "category",
      select: "name.en",
    },
  },
  {
    path: "user",
    select: ["username"],
  },
];
@Injectable()
export class TransactionsService {
  private readonly errorBuilder = new ErrorBuilder("Transactions");

  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    // Check if the status is BORROW when creating a new transaction
    if (createTransactionDto.status !== TransactionsType.borrow) {
      throw new BadRequestException(
        "New transactions must have the status 'BORROW'."
      );
    }

    // Find the book by ISBN
    const book = await this.bookModel.findOne({
      ISBN: createTransactionDto.book,
    });
    if (!book) {
      throw new NotFoundException(
        `Book with ISBN ${createTransactionDto.book} not found`
      );
    }

    // Check if the book's status is not "READY"
    if (book.status !== BookStatus.ready) {
      throw new ConflictException(
        `Book with ID ${createTransactionDto.book} is not ready for borrowing`
      );
    }

    // Find the user by username
    const user = await this.userModel.findOne({
      username: createTransactionDto.user,
    });
    if (!user) {
      throw new NotFoundException(
        `User with username ${createTransactionDto.user} not found`
      );
    }

    // Adjust the book's quantity based on the transaction status
    if (createTransactionDto.status === TransactionsType.borrow) {
      if (book.quantity <= 0) {
        throw new ConflictException("Book is not available for borrowing");
      }
      // Decrease the quantity by 1
      book.quantity = (book.quantity || 0) - 1;
    } else if (createTransactionDto.status === TransactionsType.return) {
      // Increase the quantity by 1
      book.quantity = (book.quantity || 0) + 1;
    }

    // Save the updated book quantity
    await book.save();

    // Create the transaction
    const transactionDoc = new this.transactionModel({
      ...createTransactionDto,
      user: user._id,
      book: book.id,
    });
    const transaction = await transactionDoc.save();

    return transaction.toObject();
  }

  async findAll(): Promise<Transaction[]> {
    const transaction = await this.transactionModel
      .find()
      .populate(POPULATE_PIPE)
      .lean();
    return transaction;
  }

  async findOne(id: string): Promise<Transaction> {
    try {
      const transaction = await this.transactionModel
        .findById(id)
        .populate(POPULATE_PIPE)
        .lean();
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
    // Validate returnDate based on status if status is included in updateTransactionDto
    if (
      updateTransactionDto.status === TransactionsType.borrow &&
      updateTransactionDto.returnDate
    ) {
      throw new ConflictException(
        "When status is BORROW, returnDate must not be provided."
      );
    }

    // Check if the status is being updated to RETURN, and ensure returnDate is provided
    if (
      updateTransactionDto.status === TransactionsType.return &&
      !updateTransactionDto.returnDate
    ) {
      throw new BadRequestException(
        "When status is RETURN, returnDate is required."
      );
    }

    const exists = await this.transactionModel.exists({ _id: id });
    if (!exists) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Find the current transaction
    const currentTransaction = await this.transactionModel.findById(id);
    if (!currentTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // If the book ISBN is being updated, find the book by new ISBN
    if (updateTransactionDto.book) {
      const book = await this.bookModel.findOne({
        ISBN: updateTransactionDto.book,
      });
      if (!book) {
        throw new NotFoundException(
          `Book with ISBN ${updateTransactionDto.book} not found`
        );
      }

      // Update book reference
      updateTransactionDto.book = book.id;
    }

    // If the username is being updated, find the user by new username
    if (updateTransactionDto.user) {
      const user = await this.userModel.findOne({
        username: updateTransactionDto.user,
      });
      if (!user) {
        throw new NotFoundException(
          `User with username ${updateTransactionDto.user} not found`
        );
      }

      // Update user reference
      updateTransactionDto.user = user._id;
    }

    // Check if the status is being updated to RETURN and if the book has not been returned yet
    if (
      updateTransactionDto.status === TransactionsType.return &&
      currentTransaction.status === TransactionsType.borrow
    ) {
      // Find the associated book
      const book = await this.bookModel.findById(currentTransaction.book);
      if (!book) {
        throw new NotFoundException(
          `Book with ID ${currentTransaction.book} not found`
        );
      }

      // Increase the book quantity
      book.quantity = (book.quantity || 0) + 1;
      await book.save();
    }

    // Update the transaction
    try {
      const options = { new: true };
      const updatedTransaction = await this.transactionModel
        .findByIdAndUpdate(id, updateTransactionDto, options)
        .lean();

      // If the status is updated to BORROW, adjust the book quantity
      if (
        updatedTransaction.status === TransactionsType.borrow &&
        currentTransaction.status !== TransactionsType.borrow
      ) {
        const book = await this.bookModel.findById(updatedTransaction.book);
        if (!book) {
          throw new NotFoundException(
            `Book with ID ${updatedTransaction.book} not found`
          );
        }

        if (book.quantity <= 0) {
          throw new ConflictException("Book is not available for borrowing");
        }

        // Decrease the quantity by 1
        book.quantity = (book.quantity || 0) - 1;
        await book.save();
      }

      return updatedTransaction;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(`Transaction update conflict`);
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

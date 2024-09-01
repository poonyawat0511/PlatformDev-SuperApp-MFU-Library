import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ErrorBuilder,
  ErrorMethod,
  RequestAction,
} from "src/app/common/utils/error.util";
import { CreateRenewDto } from "./dto/create-renew.dto";
import { UpdateRenewDto } from "./dto/update-renew.dto";
import { Renew } from "./schemas/renew.schema";
import { Transaction } from "src/transactions/schemas/transaction.schema";
import { RenewStatus } from "./enums/renew-status.enum";

@Injectable()
export class RenewsService {
  private readonly errorBuilder = new ErrorBuilder("Renews");
  constructor(
    @InjectModel(Renew.name)
    private readonly renewModel: Model<Renew>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>
  ) {}

  async create(createRenewDto: CreateRenewDto): Promise<Renew> {
    try {
      // Check if status is provided in the request
      if (createRenewDto.status) {
        throw new BadRequestException(
          "Status must not be provided when creating a renew."
        );
      }

      // Set the status to 'request' if not provided
      createRenewDto.status = RenewStatus.request;

      const renewDoc = new this.renewModel(createRenewDto);
      const renew = await renewDoc.save();
      return renew.toObject();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          this.errorBuilder.build(ErrorMethod.duplicated, {
            action: RequestAction.create,
          })
        );
      }
      throw error; // Re-throw other errors
    }
  }

  async findAll(): Promise<Renew[]> {
    const renew = await this.renewModel.find().lean();
    return renew;
  }

  async findOne(id: string): Promise<Renew> {
    try {
      const renew = await this.renewModel.findById(id).lean();
      if (!renew) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return renew;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateRenewDto: UpdateRenewDto): Promise<Renew> {
    const exists = await this.renewModel.exists({ _id: id });

    if (!exists) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }

    const renew = await this.renewModel.findById(id);
    if (!renew) {
      throw new NotFoundException("Renew not found");
    }

    const { status, transaction: transactionId } = updateRenewDto;

    // Find the transaction
    const transaction = await this.transactionModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    // Handle status change logic
    if (
      status === RenewStatus.approved &&
      renew.status === RenewStatus.request
    ) {
      // Extend dueDate by 7 days if status changes from request to approved
      const newDueDate = new Date(transaction.dueDate);
      newDueDate.setDate(newDueDate.getDate() + 7);
      transaction.dueDate = newDueDate;

      await transaction.save();
    } else if (
      status === RenewStatus.rejected &&
      renew.status === RenewStatus.request
    ) {
      // Handle rejection case, just update the status in the renew document
      renew.status = RenewStatus.rejected;
    }

    const options = { new: true };
    const updatedRenew = await this.renewModel
      .findByIdAndUpdate(id, updateRenewDto, options)
      .lean();

    return updatedRenew;
  }

  async remove(id: string): Promise<Renew> {
    const renew = await this.renewModel.findByIdAndDelete(id).lean();
    if (!renew) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return renew;
  }
}

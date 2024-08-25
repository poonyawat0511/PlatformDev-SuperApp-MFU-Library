import {
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
import { RegisterDTO } from "./dto/register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  private readonly errorBuilder = new ErrorBuilder("Books");

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async create(registerDTO: RegisterDTO): Promise<User> {
    try {
      const userDoc = new this.userModel(registerDTO);
      const user = await userDoc.save();
      return user.toObject();
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

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email }).lean();
      if (!user) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound)
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    const user = await this.userModel.find().lean();
    return user;
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).lean();
      if (!user) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const exists = await this.userModel.findById({ _id: id });
    try {
      if (!exists) {
        throw new NotFoundException(
          this.errorBuilder.build(ErrorMethod.notFound, { id })
        );
      }
      const options = { new: true };
      const user = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, options)
        .lean();
      return user;
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

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).lean();
    if (!user) {
      throw new NotFoundException(
        this.errorBuilder.build(ErrorMethod.notFound, { id })
      );
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, { password: newPassword }, { new: true })
      .exec();
  }
}

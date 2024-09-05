import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import {
  createResponse,
  MessageBuilder,
  ResponseMethod,
} from "src/app/common/utils/response.util";
import { CreateRenewDto } from "./dto/create-renew.dto";
import { UpdateRenewDto } from "./dto/update-renew.dto";
import { RenewsService } from "./renews.service";
import { RenewEntity } from "./entities/renew.entity";

@Controller("renews")
export class RenewsController {
  private readonly messageBuilder = new MessageBuilder("Renews");

  constructor(private readonly renewsService: RenewsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createRenewDto: CreateRenewDto) {
    const renew = await this.renewsService.create(createRenewDto);
    return createResponse(
      HttpStatus.CREATED,
      this.messageBuilder.build(ResponseMethod.create),
      new RenewEntity(renew)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const renews = await this.renewsService.findAll();
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findAll),
      renews.map((renew) => new RenewEntity(renew))
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const renew = await this.renewsService.findOne(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.findOne, { id }),
      new RenewEntity(renew)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateRenewDto: UpdateRenewDto
  ) {
    const renew = await this.renewsService.update(id, updateRenewDto);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.update, { id }),
      new RenewEntity(renew)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const renew = await this.renewsService.remove(id);
    return createResponse(
      HttpStatus.OK,
      this.messageBuilder.build(ResponseMethod.remove, { id }),
      new RenewEntity(renew)
    );
  }
}

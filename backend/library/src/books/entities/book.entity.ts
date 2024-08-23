import { MongoEntity } from "src/app/common/lib/mongo.entiy";
import { TransformUrl } from "src/app/decorator/transform-url.decorator";

export class BookEntity extends MongoEntity {
  name: { th: string; en: string };

  description: { th: string; en: string };

  @TransformUrl({ type: "string" })
  bookImage: string;

  type: { th: string; en: string };

  quantity: number;

  constructor(partial: Partial<BookEntity>) {
    super();
    Object.assign(this, partial);
  }
}

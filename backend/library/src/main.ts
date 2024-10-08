import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";
import { AppModule } from "./app.module";

async function bootstrap() {
  // app settings
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin:'*', // Replace with your frontend URL
    credentials: true, // Allow cookies to be included in requests
  });

  // Express middleware
  app.use(cookieParser());
  app.use(compression());
  app.use(morgan("dev"));

  // config
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>("port");

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle("MFU Library API Document")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("dev/api", app, document);

  await app.listen(port);
}
bootstrap();

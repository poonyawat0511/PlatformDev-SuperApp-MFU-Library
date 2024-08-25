import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as morgan from "morgan";
import * as compression from "compression";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  // app settings
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({ origin: "*" });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: "http://localhost:3000", // Replace with your frontend URL
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

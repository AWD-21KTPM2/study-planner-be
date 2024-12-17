import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: 'http://localhost:3000', // Allow all origins
  //   methods: '*', // Allow all HTTP methods
  //   allowedHeaders: '*', // Accept all headers
  //   credentials: true, // Allow credentials if necessary
  // });

  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Study planner API')
    .setDescription('21KTPM2-AWD final project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  const sortedPaths = Object.keys(document.paths)
    .sort()
    .reduce((acc, key) => {
      acc[key] = document.paths[key];
      return acc;
    }, {});

  document.paths = sortedPaths;

  // Setup Swagger module
  SwaggerModule.setup('api-doc', app, document);

  app.enableCors({
    credentials: true,
    origin: process.env.FE_URL,
  });
  await app.listen(3000);
}
bootstrap();

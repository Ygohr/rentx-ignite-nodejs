import "reflect-metadata";
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { AppError } from "@shared/errors/appError";
import { router } from "./routes";
import swaggerFile from "./swagger.json";
import createConnection from "./database";
import "./shared/container";

createConnection();
const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  return response.status(500).json({
    status: "error",
    message: `Internal server error - ${error.message}`
  });
});

app.listen(3333, () => console.log("Server is running on port 3333!"));

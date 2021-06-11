import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "@shared/middlewares/errorMiddleware";
import { router } from "./routes";
import swaggerFile from "./swagger.json";
import createConnection from "./database";
import "./shared/container";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(errorMiddleware);

export { app };

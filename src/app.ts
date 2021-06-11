import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "@shared/middlewares/errorMiddleware";
import upload from "@config/upload";
import { router } from "./routes";
import swaggerFile from "./swagger.json";
import createConnection from "./database";
import "./shared/container";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(router);

app.use(errorMiddleware);

export { app };

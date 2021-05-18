import "reflect-metadata";
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
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

app.listen(3333, () => console.log("Server is running on port 3333!"));

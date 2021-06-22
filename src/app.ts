import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "@shared/middlewares/errorMiddleware";
import rateLimiter from "@shared/middlewares/rateLimiter";
import upload from "@config/upload";
import cors from "cors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { router } from "./routes";
import swaggerFile from "./swagger.json";
import createConnection from "./database";
import "./shared/container";

createConnection();
const app = express();

app.use(rateLimiter);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(cors());
app.use(router);

app.use(Sentry.Handlers.errorHandler());

app.use(errorMiddleware);

export { app };

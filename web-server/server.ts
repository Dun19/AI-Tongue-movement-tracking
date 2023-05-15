import express, { Request, Response, NextFunction } from "express";
import { env } from "./env";
// import { userRoute } from "./routes/user.route";
import { HttpError } from "./error";
import { print } from "listening-on";
import { newKnex } from "./knex";
import fs from "fs";
import { TongueController } from "./tongue.controller";
import { TongueService } from "./tongue.service";

const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

let app = express();

let knex = newKnex();

app.use((req, res, next) => {
  knex
    .insert({
      method: req.method,
      url: req.url,
      user_agent: req.headers["user-agent"],
    })
    .into("request_log")
    .catch((error) => {
      console.error("failed to insert request_log:", error);
    });
  next();
});

app.use(express.static("../web-client/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(userRoute)
let tongueService = new TongueService(knex);
let tongueController = new TongueController(tongueService);
app.use(tongueController.router);

app.use((req, res, next) => {
  next(new HttpError(404, "route not found"));
});
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.statusCode || 500);
  res.json({ error: String(error) });
});

app.listen(env.PORT, () => {
  print(env.PORT);
});

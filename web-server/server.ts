import express, { Request, Response, NextFunction } from "express";
import { env } from "./env";
// import { userRoute } from "./routes/user.route";
import { tongueRoute } from "./routes/tongue.route";
import { HttpError } from "./error";
import { print } from "listening-on";
import { newKnex } from "./knex";
import fs from "fs";

const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

let app = express();

app.use((req, res, next) => {
  let knex = newKnex();
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

// app.use(userRoute);

app.use(tongueRoute);

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

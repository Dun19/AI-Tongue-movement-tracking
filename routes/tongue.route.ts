import { Router } from "express";
import { knex } from "../knex";
import { HttpError } from "../error";

export let tongueRecognitionRoute = Router();

tongueRecognitionRoute.get("/tongueAI", async (req, res, next) => {
  try {
  } catch (error) {
    next(new HttpError(500, String(error)));
  }
});

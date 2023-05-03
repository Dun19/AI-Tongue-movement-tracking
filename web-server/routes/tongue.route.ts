import { Router } from "express";

import { HttpError } from "../error";
import formidable from "formidable";
import { TongueService } from "../tongue.service";
import { newKnex } from "../knex";
import { TongueController } from "../tongue.controller";

export let tongueRoute = Router();
let knex = newKnex();
let tongueService = new TongueService(knex);
let tongueController = new TongueController(tongueService);

tongueRoute.use(tongueController.router);

import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { runDsaCode } from "../controllers/code.controller.js";

const codeRouter = express.Router();

codeRouter.post("/run", isAuth, runDsaCode);

export default codeRouter;

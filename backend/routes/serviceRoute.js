import { Router } from "express";
import { createService } from "../controllers/serviceController.js";
import {checkUserAuth} from "../middlewares/authMiddleware.js";
import {isProvider} from "../middlewares/roleMiddleware.js";

const router = Router();

router.post("/create", checkUserAuth, isProvider, createService);

export default router;
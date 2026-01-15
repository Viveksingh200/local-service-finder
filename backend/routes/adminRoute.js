import { Router } from "express";
import { getPendingServices } from "../controllers/adminController.js";
import { checkUserAuth } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/pending-services",checkUserAuth, isAdmin, getPendingServices);

export default router;
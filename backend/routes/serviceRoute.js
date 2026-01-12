import { Router } from "express";
import { createService, deleteService, getAllServices, updateService } from "../controllers/serviceController.js";
import {checkUserAuth} from "../middlewares/authMiddleware.js";
import {isProvider} from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", getAllServices);
router.post("/create", checkUserAuth, isProvider, createService);
router.put("/update/:id", checkUserAuth, isProvider, updateService);
router.delete("/delete/:id", checkUserAuth, isProvider, deleteService);

export default router;
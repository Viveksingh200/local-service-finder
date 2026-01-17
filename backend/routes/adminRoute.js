import { Router } from "express";
import { approveService, getApprovedServices, getPendingServices } from "../controllers/adminController.js";
import { checkUserAuth } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/pending-services",checkUserAuth, isAdmin, getPendingServices);

//Approve services 
router.patch("/approve/:id", checkUserAuth, isAdmin, approveService);

//Get approved services
router.get("/approved-services", checkUserAuth, isAdmin, getApprovedServices);

//

export default router;
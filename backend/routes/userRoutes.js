import { Router } from "express";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { getUserLastGame, getUserTotalStats } from "../controllers/user";

const router = Router();

router.get('/lastGame', verifyToken, getUserLastGame);

router.get('/totalStats', verifyToken, getUserTotalStats);

export default router
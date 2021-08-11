import { Router } from "express";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { getUserGameHistory, saveUserGameResult } from "../controllers/user";

const router = Router();

router.get('/gameHistory', verifyToken, getUserGameHistory);

router.post('/gameHistory', verifyToken, saveUserGameResult);

export default router
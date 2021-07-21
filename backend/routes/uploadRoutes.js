import { Router } from "express";
import fileUpload from "express-fileupload";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { uploadAvatar } from "../controllers/upload";

const router = Router();

const uploadOptions = {
  uploadTimeout: 10000,
}

router.post('/avatar', verifyToken, fileUpload(uploadOptions), uploadAvatar);

export default router
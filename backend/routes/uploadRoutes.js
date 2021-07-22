import { Router } from "express";
import fileUpload from "express-fileupload";
import { verifyToken } from "../middlewares/verifyTokenMiddleware";
import { uploadAvatar, getAvatar } from "../controllers/upload";

const router = Router();

const uploadOptions = {
  uploadTimeout: 10000,
}

router.post('/upload', verifyToken, fileUpload(uploadOptions), uploadAvatar);

router.get('/:id', getAvatar);

export default router
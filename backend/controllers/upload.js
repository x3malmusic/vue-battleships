import sharp from "sharp";
import { asyncHandler } from "../middlewares/async";
import { NO_FILE_TO_UPLOAD } from "../helpers/errorTypes";
import { uploadImg, getImg } from "../services/dbService";

export const uploadAvatar = asyncHandler( async (req, res, next) => {
  if (!req.files) return next(NO_FILE_TO_UPLOAD);

  const { userId } = req.user;
  const { image } = req.files;

  const data = await sharp(image.data).resize({ width: 40, height: 40 }).png({ compressionLevel: 6 }).toBuffer();
  const imageId = await uploadImg(data, userId)
  res.json(imageId)
});

export const getAvatar = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const imgStream = await getImg(id);
  imgStream.pipe(res)
})
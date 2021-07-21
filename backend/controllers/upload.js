import sharp from "sharp";
const { Readable } = require('stream');
import { Avatar } from "../database";
import { User } from "../models/User";
import { asyncHandler } from "../middlewares/async";
import { NO_FILE_TO_UPLOAD, UPLOAD_FAILED, USER_NOT_FOUND } from "../helpers/errorTypes";

export const uploadAvatar = asyncHandler( async (req, res, next) => {
  if (!req.files) return next(NO_FILE_TO_UPLOAD);

  const { userId } = req.user;
  const { image } = req.files;
  const data = await sharp(image.data).resize(20).png({ compressionLevel: 3 }).toBuffer()
  const img = Buffer.from(data).toString('base64');

  const options = ({ filename: image.name, contentType: image.mimetype });
  const stream = Readable.from(img);

  Avatar.write(options, stream, async (err, file) => {
    if (err) return next(UPLOAD_FAILED)

    const user = await User.findOne({_id: userId})
    if (!user) return next(USER_NOT_FOUND);
    user.avatar = file._id;
    await user.save();

    res.send(img)
  });
});
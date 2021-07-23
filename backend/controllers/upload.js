import sharp from "sharp";
import Stream from "stream";
import { Avatar } from "../database";
import { User } from "../models/User";
import { asyncHandler } from "../middlewares/async";
import { avatarImgName } from "../constants";
import { NO_FILE_TO_UPLOAD, UPLOAD_FAILED, USER_NOT_FOUND, FILE_NOT_FOUND } from "../helpers/errorTypes";

export const uploadAvatar = asyncHandler( async (req, res, next) => {
  if (!req.files) return next(NO_FILE_TO_UPLOAD);

  const { userId } = req.user;
  const { image } = req.files;

  const data = await sharp(image.data).resize({ width: 40, height: 40 }).png({ compressionLevel: 6 }).toBuffer();
  const stream = new Stream.PassThrough()
  stream.end(data)

  const options = ({ filename: avatarImgName, contentType: 'image/png' });

  Avatar.write(options, stream, async (err, file) => {
    if (err) return next(UPLOAD_FAILED)

    const user = await User.findOne({_id: userId})
    if (!user) return next(USER_NOT_FOUND);

    if (user.avatar) Avatar.unlink(user.avatar, () => {})

    user.avatar = file._id;
    await user.save();

    res.json(file._id);
  });
});

export const getAvatar = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  Avatar.findById({_id: id}, (err, file) => {
    if (err || !file) return next(FILE_NOT_FOUND)

    const stream = file.read();
    stream.pipe(res)
  })
})
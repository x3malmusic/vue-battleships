import { User } from "../models/User";
import { Game } from "../models/Game";
import Stream from "stream";
import { avatarImgName } from "../constants";
import { Avatar } from "../database";
import { FILE_NOT_FOUND, UPLOAD_FAILED, USER_NOT_FOUND } from "../helpers/errorTypes";

export const getUserByName = (name) => {
  return User.findOne({ name })
}

export const getUserById = (id) => {
  return User.findOne({ _id: id })
}

export const createUser = async (name, password) => {
  const user = new User({ name, password });
  await user.save();
  return user
}

export const uploadImg = (buffer, userId) => {
  const stream = new Stream.PassThrough()
  stream.end(buffer)

  const options = ({ filename: avatarImgName, contentType: 'image/png' });
  return new Promise((resolve, reject) => {
    Avatar.write(options, stream, async (err, file) => {
      if (err) return reject(UPLOAD_FAILED)

      const user = await getUserById(userId)
      if (!user) return reject(USER_NOT_FOUND);

      if (user.avatar) Avatar.unlink(user.avatar, () => {})

      user.avatar = file._id;
      await user.save();

      resolve(file._id)
    });
  })
}

export const getImg = (id) => {
  return new Promise((resolve, reject) => {
    Avatar.findById({_id: id}, (err, file) => {
      if (err || !file) return reject(FILE_NOT_FOUND)

      const stream = file.read();
      resolve(stream)
    })
  })
}

export const saveGameResult = async ({ shots, hit, miss, win, bullseye, userId }) => {
  const game = new Game({ shots, hit, miss, win, bullseye, user: userId });
  await game.save();

  const user = await getUserById(userId);
  user.gameHistory.push(game._id);
  await user.save();
  return game
}

export const getGameHistory = async (userId) => {
  const user = await User.findOne({ _id: userId }).populate('gameHistory')
  return user.gameHistory
}
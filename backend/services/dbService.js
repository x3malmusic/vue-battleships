import { User } from "../models/User";
import { LastGame } from "../models/LastGame";
import { TotalStats } from "../models/TotalStats";
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

  const lastGame = await createGameResult(user._id)
  const totalStats = await createTotalStats(user._id)
  user.lastGame = lastGame._id
  user.totalStats = totalStats._id
  await user.save()

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

export const createGameResult = async (userId) => {
  const game = new LastGame({ user: userId });
  await game.save();
  return game
}

export const createTotalStats = async (userId) => {
  const stats = new TotalStats({ user: userId });
  await stats.save();
  return stats
}

export const updateGameResult = async ({ shots, hit, miss, win, bullseye, userId, opponent }) => {
  const lastGame = await LastGame.findOne({ user: userId })

  lastGame.shots = shots;
  lastGame.hit = hit;
  lastGame.miss = miss;
  lastGame.win = win;
  lastGame.bullseye = bullseye;
  lastGame.opponent = opponent;

  await lastGame.save();
  return lastGame
}

export const updateTotalStats = async ({ shots, hit, miss, win, bullseye, userId }) => {
  const stats = await TotalStats.findOne({ user: userId })
  stats.totalMatches += 1;
  stats.shots += shots;
  stats.hit += hit;
  stats.miss += miss;

  if (win) stats.wins += 1;
  else stats.losses += 1;

  if (bullseye) stats.bullseye += 1;
  stats.winrate = `${Math.ceil((stats.wins / stats.totalMatches) * 100)}%`

  await stats.save()
  return stats
}

export const getLastGame = async (userId) => {
  const user = await User.findOne({ _id: userId }).populate('lastGame')
  const { shots, hit, miss, bullseye, win, opponent } = user.lastGame
  return { shots, hit, miss, bullseye, win, opponent }
}

export const getTotalStats = async (userId) => {
  const user = await User.findOne({ _id: userId }).populate('totalStats')
  const { shots, hit, miss, winrate, bullseye, totalMatches, wins, losses } = user.totalStats
  return { shots, hit, miss, winrate, bullseye, totalMatches, wins, losses }
}
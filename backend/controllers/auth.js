import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator'
import { asyncHandler } from "../middlewares/async";
import { getUserByName, createUser } from "../services/dbService"
import {
  USER_NOT_FOUND,
  USER_EXIST,
  NAME_PASSWORD_WRONG,
} from "../helpers/errorTypes";

export const register = asyncHandler(async (req, res, next) => {
  const { name, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors.array()[0].msg)

  const candidate = await getUserByName(name);
  if (candidate) return next(USER_EXIST);

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser(name, hashedPassword);

  const token = jwt.sign({ userId: user.id, name }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.send({ userId: user.id, name: user.name, avatar: user.avatar, token });
});

export const login = asyncHandler( async (req, res, next) => {
  const { name, password } = req.body;

  const user = await getUserByName(name);
  if (!user) return next(USER_NOT_FOUND);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(NAME_PASSWORD_WRONG);

  const token = jwt.sign({ userId: user.id, name: user.name }, process.env.JWT_SECRET,{ expiresIn: "24h" });
  res.send({ userId: user.id, name: user.name, avatar: user.avatar, token });
});

export const silentLogin = async (req, res, next) => {
  const { name } = req.user;

  const user = await getUserByName(name);
  if (!user) return next(USER_NOT_FOUND);

  res.send({ userId: user.id, name: user.name, avatar: user.avatar })
}

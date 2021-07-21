import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { asyncHandler } from "../middlewares/async";
import {
  USER_NOT_FOUND,
  USER_EXIST,
  NAME_PASSWORD_WRONG,
  NAME_PASSWORD_EMPTY,
} from "../helpers/errorTypes";

export const register = asyncHandler(async (req, res, next) => {
  const { name, password } = req.body;
  if(!name.trim() || !password.trim()) {
    return next(NAME_PASSWORD_EMPTY);
  }

  const candidate = await User.findOne({ name });
  if (candidate) {
    return next(USER_EXIST);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({ name, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ userId: user.id, name }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  res.send({ userId: user.id, name: user.name, avatar: user.avatar, token });
});

export const login = asyncHandler( async (req, res, next) => {
  const { name, password } = req.body;

  if (!name.trim() || !password.trim()) {
    return next(NAME_PASSWORD_EMPTY);
  }

  const user = await User.findOne({ name });
  if (!user) {
    return next(USER_NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(NAME_PASSWORD_WRONG);
  }

  const token = jwt.sign(
    { userId: user.id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  res.send({ userId: user.id, name: user.name, avatar: user.avatar, token });
});

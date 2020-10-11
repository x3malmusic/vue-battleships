import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import {
  USER_NOT_FOUND,
  USER_EXIST,
  NAME_PASSWORD_WRONG,
  NAME_PASSWORD_EMPTY,
} from "../errorTypes";

export const register = async (player) => {
  if (player.name.trim() && player.password.trim()) {
    const { name, password } = player;

    const candidate = await User.findOne({ name });

    if (candidate) {
      throw new Error(USER_EXIST);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user.id, name }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return { userId: user.id, name: user.name, token };
  } else throw new Error(NAME_PASSWORD_EMPTY);
};

export const login = async (player) => {
  if (player.name.trim() && player.password.trim()) {
    const { name, password } = player;
    const user = await User.findOne({ name });

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error(NAME_PASSWORD_WRONG);
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    return { userId: user.id, name: user.name, token };
  } else throw new Error(NAME_PASSWORD_EMPTY);
};

import { User } from "../models/User";

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
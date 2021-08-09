import error, { UNKNOWN_ERROR, DATABASE_ERROR } from "../helpers/errorTypes";
import mongoose from "mongoose";

const errorHandler = (err, req, res, next) => {
  if(error[err]) {
    return res.status(error[err].status).json({ message: error[err].message, type: err })
  }

  if(err instanceof mongoose.Error) {
    console.log("db Error", err);
    return res.status(error[DATABASE_ERROR].status).json({ message: error[DATABASE_ERROR].message, type: DATABASE_ERROR })
  }

  console.log("exception Error", err);
  res.status(error[UNKNOWN_ERROR].status).json({ message: error[UNKNOWN_ERROR].message, type: UNKNOWN_ERROR })
};

export default errorHandler
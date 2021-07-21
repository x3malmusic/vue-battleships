import mongoose from "mongoose";
const { createModel } = require('mongoose-gridfs');

export let Avatar;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    Avatar = createModel({
      modelName: 'Avatar',
      connection: conn.connection
    });

    console.log(`connected: ${conn.connection.host}`);
  } catch (e) {
    console.log(e);

    // try to reconnect to database
    setTimeout(async () => {
      await connectDB();
    }, 10000);
  }
};

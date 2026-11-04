import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(`${process.env.MONGODB_URI}/chat-app`)
    .then(() => {
      console.log("connected to mongoDB");
    })
    .catch((error) => {
      console.log(error);
    });
};

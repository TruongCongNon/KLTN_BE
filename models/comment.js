import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // comment là subdocument, không cần _id riêng
);

export default commentSchema;

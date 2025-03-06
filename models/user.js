import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        admin: {
            type: Boolean,
            default: false,
        },
        status:{
            type: String
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema)
export default User
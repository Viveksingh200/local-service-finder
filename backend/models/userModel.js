import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "provider"],
        default: "user"
    }
},
    {timestamps: true}
);

export const User = mongoose.model("User", userSchema);
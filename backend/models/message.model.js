import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
    {
        message: {
            text: { type: String, required: true },
        },
        users: {
            type: Array,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Message = mongoose.model("Message", MessageSchema);
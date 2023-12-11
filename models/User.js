import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const userSchemaMngs = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: String,
}, { versionKey: false, timestamps: true, });

userSchemaMngs.post("save", handleSaveError);
userSchemaMngs.pre("findOneAndUpdate", preUpdate);
userSchemaMngs.post("findOneAndUpdate", handleSaveError);

export const userSchemaJoi = Joi.object({
    password: Joi.string().required().messages({ "any.required": "missing required password field" }),
    email: Joi.string().required().messages({ "any.required": "missing required email field" }),
    subscription: Joi.valid("starter", "pro", "business").default("starter"),
});

export const userSubscriptionUpdateJoi = Joi.object({
    subscription: Joi.valid("starter", "pro", "business").required(),
})

export const User = model("user", userSchemaMngs);
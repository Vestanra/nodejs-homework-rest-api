import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const contactSchemaMngs = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: [true, 'Set email for contact'],
    },
    phone: {
        type: String,
        required: [true, 'Set phone for contact'],
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false });

contactSchemaMngs.post("save", handleSaveError);
contactSchemaMngs.pre("findOneAndUpdate", preUpdate);
contactSchemaMngs.post("findOneAndUpdate", handleSaveError);

export const contactSchemaJoi = Joi.object({
    name: Joi.string().required().messages({"any.required": "missing required name field"}),
    email: Joi.string().required().messages({"any.required": "missing required email field"}),
    phone: Joi.number().required().messages({ "any.required": "missing required phone field" }),
    favorite: Joi.boolean(),
});

export const contactUpdateSchemaJoi = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.number(),
    favorite: Joi.boolean(),
});

export const contactFavoriteSchemaJoi = Joi.object({
    favorite: Joi.boolean().required(),
})

export const Contact = model("contact", contactSchemaMngs);
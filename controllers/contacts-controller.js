import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { Contact, contactFavoriteSchemaJoi, contactSchemaJoi, contactUpdateSchemaJoi } from "../models/Contact.js";

const listContacts = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
};

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { error } = contactSchemaJoi.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { error } = contactUpdateSchemaJoi.validate(req.body);
    if (error) {
        throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result);
};

const removeContact = async (req, res, next) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json({ "message": "contact deleted" })
};

const updateStatusContact = async (req, res) => {
    const { error } = contactFavoriteSchemaJoi.validate(req.body);
    if (error) {
        throw HttpError(400, error.message)
    }
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)
};

export default {
    listContacts: ctrlWrapper(listContacts),
    getById: ctrlWrapper(getById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    removeContact: ctrlWrapper(removeContact),
}
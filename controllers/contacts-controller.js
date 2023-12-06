import contactService from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";
import { contactSchema, contactUpdateSchema } from "../schemas/contactSchema.js";
import { ctrlWrapper } from "../decorators/index.js";

const listContacts = async (req, res) => {
    const result = await contactService.getAllContacts();
    res.json(result);
};

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await contactService.getContactById(id);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        throw HttpError(400, "missing required name field")
    }
    const result = await contactService.add(req.body);
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactService.updateContact(id, req.body);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result);
};

const removeContact = async (req, res, next) => {
    const { id } = req.params;
    const result = await contactService.removeContact(id);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json({ "message": "contact deleted" })
};

export default {
    listContacts: ctrlWrapper(listContacts),
    getById: ctrlWrapper(getById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    removeContact: ctrlWrapper(removeContact),
}
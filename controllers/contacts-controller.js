import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { Contact } from "../models/Contact.js";

const listContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const query = {owner}
    if (favorite === "true") {
        query.favorite = true;
    }
    const result = await Contact.find(query, "-createdAt -updatedAt", { skip, limit }).populate("owner", "_id email subscription");
    res.json(result);
};

const getById = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id: id, owner });
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result);
};

const removeContact = async (req, res, next) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndDelete({ _id: id, owner });
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json({ "message": "contact deleted" })
};

const updateStatusContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body);
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
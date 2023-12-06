import fs from 'fs/promises';
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");

const getAllContacts = async () => {
    const result = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(result);
}

const getContactById = async (contactId) => {
    const contacts = await getAllContacts();
    const result = contacts.find(el => el.id === contactId);
    return result || null;
}

const removeContact = async (contactId) => {
    const contacts = await getAllContacts();
    const index = contacts.findIndex(el => el.id === contactId);
    if (index === -1) {
        return null
    };
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
}

const add = async ({name, email, phone}) => {
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    }
    const contacts = await getAllContacts();
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
}

const updateContact = async (contactId, body) => {
    const contacts = await getAllContacts();
    const index = contacts.findIndex(el => el.id === contactId);
    if (index === -1) {
        return null
    };
    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
}

export default {
    getAllContacts,
    getContactById,
    removeContact,
    add,
    updateContact,
}

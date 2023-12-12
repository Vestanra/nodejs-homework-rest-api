import express from "express";
import contactsController from "../../controllers/contacts-controller.js"
import { isEmptyBody, isValidId, isEmptyFavoriteBody, authenticate } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { contactFavoriteSchemaJoi, contactSchemaJoi, contactUpdateSchemaJoi } from "../../models/Contact.js";

const contactsRouter = express.Router()

contactsRouter.get('/', authenticate, contactsController.listContacts)

contactsRouter.get('/:id', authenticate, isValidId, contactsController.getById)

contactsRouter.post('/', authenticate, isEmptyBody, validateBody(contactSchemaJoi), contactsController.addContact)

contactsRouter.delete('/:id', authenticate, contactsController.removeContact)

contactsRouter.put('/:id', authenticate, isValidId, isEmptyBody, validateBody(contactUpdateSchemaJoi), contactsController.updateContact)

contactsRouter.patch('/:id/favorite', authenticate, isValidId, isEmptyFavoriteBody, validateBody(contactFavoriteSchemaJoi), contactsController.updateStatusContact)

export default contactsRouter;

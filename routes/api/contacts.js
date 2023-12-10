import express from "express";

import contactsController from "../../controllers/contacts-controller.js"
import { isEmptyBody, isValidId, isEmptyFavoriteBody } from "../../middlewares/index.js";

const router = express.Router()

router.get('/', contactsController.listContacts)

router.get('/:id', isValidId, contactsController.getById)

router.post('/', isEmptyBody, contactsController.addContact)

router.delete('/:id', contactsController.removeContact)

router.put('/:id', isValidId, isEmptyBody, contactsController.updateContact)

router.patch('/:id/favorite', isValidId, isEmptyFavoriteBody, contactsController.updateStatusContact)

export default router;

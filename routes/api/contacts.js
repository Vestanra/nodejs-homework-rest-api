import express from "express";

import contactsController from "../../controllers/contacts-controller.js"
import isEmptyBody from "../../middlewares/isEmptyBody.js";

const router = express.Router()

router.get('/', contactsController.listContacts)

router.get('/:id', contactsController.getById)

router.post('/', isEmptyBody, contactsController.addContact)

router.delete('/:id', contactsController.removeContact)

router.put('/:id', isEmptyBody, contactsController.updateContact)

export default router;

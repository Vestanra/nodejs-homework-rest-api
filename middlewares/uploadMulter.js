import multer from "multer";
import path from "path";

const destination = path.resolve("tmp")

const storage = multer.diskStorage({
    destination,
});

const uploadMulter = multer({
    storage,
});

export default uploadMulter;
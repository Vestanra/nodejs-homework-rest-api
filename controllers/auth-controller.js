import { User } from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotevn from "dotenv";
import path from "path";
import Jimp from "jimp";
import gravatar from "gravatar";

dotevn.config();

const { SECRET_KEY } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email);

    const result = await User.findOne({ email });
    if (result) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});
    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": newUser.subscription,
        }
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(res)

    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        token,
        "user": {
            "email": user.email,
            "subscription": user.subscription,
        }
    })    
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription,
    })
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" })
    res.status(204).json()
}

const updateSubscription = async (req, res) => {
    const { _id, email } = req.user;
    console.log(req.body)
    const userUpdate = await User.findByIdAndUpdate(_id, req.body)
    res.json({
        email,
        subscription: userUpdate.subscription,
    })
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    if (!req.file) {
        throw HttpError(400, "missing fields avatars")
    }
    const { path: oldPath, originalname } = req.file;
    const fileName = `${_id}_${originalname}`
    const newPath = path.join(avatarsPath, fileName);

    const image = await Jimp.read(oldPath);
    image.cover(250, 250);
    await image.writeAsync(newPath);

    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, avatarURL);
    res.json({avatarURL})
};

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}
import { User } from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotevn from "dotenv";
import path from "path";
import Jimp from "jimp";
import gravatar from "gravatar";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import { nanoid } from "nanoid";

dotevn.config();

const avatarsPath = path.resolve("public", "avatars");

const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const result = await User.findOne({ email });
    if (result) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    }
    await sendEmail(verifyEmail)

    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": newUser.subscription,
        }
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify");
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
    await fs.unlink(oldPath);

    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, avatarURL);
    res.json({avatarURL})
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, 'User not found');
    }
    await User.findOneAndUpdate(user._id, { verificationToken: null, verify: true });
    res.json({ "message": 'Verification successful', })
};

const resendVerify = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(400, "Email not found")
    }
    if (!user.verificationToken) {
        throw HttpError(400, "Verification has already been passed")
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    }
    await sendEmail(verifyEmail);
    res.json("Verification email sent")
};

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { userSigninSchema, userSignupSchema } from "../schema/user.js";
import dotenv from "dotenv";
dotenv.config();
const jwtsecret = process.env.JWT_SECRET;
export const signinHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPayload = req.body;
    const isValid = userSigninSchema.safeParse(userPayload);
    if (!isValid.success) {
        res.json({ message: "Invalid email or password" });
        return;
    }
    const user = yield User.findOne({
        email: userPayload.email,
        password: userPayload.password,
    });
    if (user) {
        const token = yield jwt.sign({ user }, jwtsecret);
        res.status(200).json({
            message: "User signed in",
            user: user,
            token: token,
        });
    }
    else {
        res.status(200).json({
            message: "Incorrect email or password",
            user: null,
            token: null,
        });
    }
});
export const signinWithGoogleHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPayload = req.body;
    const user = yield User.findOne({
        email: userPayload.email,
    });
    if (user) {
        const token = yield jwt.sign({ user }, jwtsecret);
        res.status(200).json({
            message: "User signed in",
            user: user,
            token: token,
        });
    }
    else {
        res.status(200).json({
            message: "Incorrect email or password",
            user: null,
            token: null,
        });
    }
});
export const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPayload = req.body;
    const isValid = userSignupSchema.safeParse(userPayload);
    if (!isValid.success) {
        res.json({ message: "Invalid email or password" });
        return;
    }
    const userExists = yield User.findOne({
        email: userPayload.email,
    });
    if (!userExists) {
        const user = yield User.create({
            name: userPayload.name,
            email: userPayload.email,
            phone: userPayload.phone,
            password: userPayload.password,
            country: userPayload.country
        });
        res.status(200).json({
            message: "User created",
            user: user,
        });
    }
    else {
        res.status(200).json({
            message: "User exists",
            user: null,
        });
    }
});

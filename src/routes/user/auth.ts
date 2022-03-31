import { Router } from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { RequestValidationError } from "../../errors/request-validation-error";
import { BadRequestError } from "../../errors/bad-request-error";
import { AuthenticationError } from "../../errors/auth-error";
import { User } from "../../models/user";
import 'express-async-errors'; // prevents async error
import { JWT_SECRET } from "../../util/env";
const router = Router();

router.post("/sign-up",
    body("username").isString(),
    body("email").isEmail(),
    body("password").isLength({
        min: 6
    })
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        } else {
            const { username, email, password } = req.body;
            let existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new BadRequestError("Email in use.");
            } else {
                let user = User.build({
                    username,
                    email,
                    password
                });
                await user.save();
                res.status(201).send("Account created.");
            }
        }
    });

router.post("/sign-in", body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        } else {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) throw new AuthenticationError("Invalid credentials.");
            // match pwd.
            const isMatched = await bcrypt.compare(password, user.password);
            if (isMatched === false) throw new AuthenticationError("Invalid credentials.");
            // generate jwt token.
            const token = jwt.sign({
                id: user._id,
                username: user.username
            }, JWT_SECRET);
            res.send(token);
        }
    })

export {
    router
}
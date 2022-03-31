import e, { Router } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../../errors/request-validation-error";
import { BadRequestError } from "../../errors/bad-request-error";
import { User } from "../../models/user";
import 'express-async-errors'; // prevents async error
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
                throw new BadRequestError("Email in use");
            } else {
                let user = User.build({
                    username,
                    email,
                    password
                });
                await user.save();
                res.status(201).send(user);
            }
        }

    });

export {
    router
}
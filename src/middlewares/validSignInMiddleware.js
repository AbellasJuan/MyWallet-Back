import signInSchema from "../schemas/signInSchema.js";

export function validSignInMiddleware(req, res, next) {
    const { email, password } = req.body;

    const validation = signInSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(error => error.message));
    }
    next();
}
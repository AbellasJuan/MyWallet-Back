import signUpSchema from "../schemas/signUpSchema.js";

export function validUserMiddleware(req, res, next) {
    const {name, email, password} = req.body;

    const validation = signUpSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(error => error.message));
    }

    next();
}
import registersSchema from "../schemas/registersSchema.js";

export function validRegisterMiddleware(req, res, next) {
    const { value , description } = req.body;

    const validation = registersSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(error => error.message));
    }
    next();
}

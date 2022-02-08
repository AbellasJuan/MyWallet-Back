import joi from 'joi';

const registersSchema = joi.object({
    description: joi.string().min(2).required(),
    value: joi.number().min(1).required(),
});

export default registersSchema;
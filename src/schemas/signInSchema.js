import joi from 'joi';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const signInSchema = joi.object({
    email: joi.string().pattern(new RegExp(emailRegex)).required(),
    password: joi.string().min(3).required()
});

export default signInSchema;
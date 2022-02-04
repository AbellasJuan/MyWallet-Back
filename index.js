import express, { json } from 'express';
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import joi from 'joi';
import { stripHtml } from 'string-strip-html';
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db("MyWallet");
});

const userSchema = joi.object({
    name: joi.string().max(30).required(),
    email: joi.string().max(100).required(),
    password: joi.string().max(50).required()
})

app.post('/auth/sign-up', async (req, res) => {
    const {name, email, password} = req.body;
    
    const validation = userSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(error => error.message))       ;
    }

    const hashSenha = bcrypt.hashSync(password, 10);
        
    try {
        await db.collection('users').insertOne(
            { 
                "name": stripHtml(name).result.trim(),
                "email": stripHtml(email).result.trim(),
                "password": hashSenha
            }
        );
            
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/auth/sign-in', async (req, res) => {
    
    const { email, senha } = req.body;
    
    try {
        const participantRegistered = await db.collection('users').findOne({ email: email });
            
        res.status(200).send(participantRegistered);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/users', async (req, res) => {
   
    try {
      
        const users = await db.collection('users').find({}).toArray();
              
         res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/new-entry', async (req, res)=>{
    const { valor , descricao } = req.body;

    try {

        const time = dayjs().locale('pt-br').format('DD/MM');

        await db.collection('registers').insertOne(
            {
                "valor": parseFloat(+valor),
                "descricao": descricao,
                "isCredit": true,
                "data": time
            }
        );
        
        res.sendStatus(201);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

app.post('/new-exit', async (req, res)=>{
    const { valor , descricao } = req.body;

    try {

        const time = dayjs().locale('pt-br').format('DD/MM');

        await db.collection('registers').insertOne(
            {
                "valor": parseFloat(-valor),
                "descricao": descricao,
                "isCredit": false,
                "data": time
            }
        );
        
        res.sendStatus(201);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

app.get('/userRegisters', async (req, res)=>{

    try {

        const registers = await db.collection('registers').find({}).toArray();

        res.status(200).send(registers);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500)    
    }
})

app.listen(5000);
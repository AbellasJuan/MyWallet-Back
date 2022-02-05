import express, { json } from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
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
    password: joi.required()
})

const signInSchema = joi.object({
    email: joi.string().required(),
    password: joi.required()
  })
  
  
app.post('/auth/sign-in', async (req, res) => {
      const { email, password } = req.body;
  
      const validation = signInSchema.validate(req.body, { abortEarly: false });
  
      if (validation.error) {
          return res.status(422).send(validation.error.details.map(error => error.message));
      }
      
      try {
          const user = await db.collection('users').findOne({ email: email });
         
          if (!user) {
              return res.sendStatus(401);
          }
          
          if(bcrypt.compareSync(password, user.password)) {
            const token = uuid();
            await db.collection("session").insertOne({ token, userId: user._id, userName: user.name });
            const teste = await db.collection('session').findOne({ userName: user.name });
            return res.status(200).send(teste);
          }  
  
  
          res.sendStatus(401);
      } catch (error) {
          console.error(error);
          res.sendStatus(500);
      }
});

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

app.get('/userRegisters', async (req, res)=>{
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');

    try {
        const session = await db.collection("session").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        }
        
        const registers = await db.collection('registers').find({ registerUserId: new ObjectId(session.userId) }).toArray();

        res.status(200).send(registers);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500)    
    }
})

app.post('/new-entry', async (req, res)=>{
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');

    const { value , description } = req.body;

    try {

        const session = await db.collection("session").findOne({ token });
        if (!session) {
            return res.sendStatus(401);
        }

        const time = dayjs().locale('pt-br').format('DD/MM');

        await db.collection('registers').insertOne(
            {
                "value": parseFloat(+value),
                "description": description,
                "isCredit": true,
                "date": time,
                "registerUserId": session.userId  
            }
        );
        
        res.sendStatus(201);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

app.post('/new-exit', async (req, res)=>{
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');

    const { value , description } = req.body;

    try {

        const session = await db.collection("session").findOne({ token });
        if (!session) {
            return res.sendStatus(401);
        }

        const time = dayjs().locale('pt-br').format('DD/MM');

        await db.collection('registers').insertOne(
            {
                "value": parseFloat(+value),
                "description": description,
                "isCredit": false,
                "date": time,
                "registerUserId": session.userId  
            }
        );
        
        res.sendStatus(201);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

app.get("/user", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
  
    try {
      const session = await db.collection("session").findOne({ token });
      
      if (!session) {
        return res.sendStatus(401);
      }
  
      const user = await db.collection("users").findOne({ _id: session.userId });
      if (!user) {
        return res.sendStatus(401);
      }
  
      res.send(user)
    } catch (error) { 
      console.log(error);
      res.sendStatus(500);
    }
})

app.delete('/sign-out', async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');

    try{
        const session = await db.collection("session").deleteOne({token});
        return res.sendStatus(200);
    }catch (erro) {
        console.log(erro);
        res.sendStatus(500);
    }
});

app.listen(5000);
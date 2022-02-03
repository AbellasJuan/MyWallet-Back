import express, { json } from 'express';
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db("MyWallet");
});

app.post('/auth/sign-up', async (req, res) => {
    
    try {
    
        await db.collection('users').insertOne(
            { 
                "nome": "FULANO",
                "email": "blablabla@email.com", 
                "senha": "senha123456"
            }
        );
            
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/auth/sign-up', async (req, res) => {
   
    try {
      
        const users = await db.collection('users').find({}).toArray();
              
         res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.listen(5000);
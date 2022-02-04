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
    
    const {nome, email, senha} = req.body;
    
    try {
        await db.collection('users').insertOne(
            { 
                "nome": nome,
                "email": email, 
                "senha": senha
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

        const newEntry = await db.collection('registers').insertOne(
            {
                "valor": parseInt(+valor),
                "descricao": descricao,
                "isCredit": true
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

        const newExit = await db.collection('registers').insertOne(
            {
                "valor": parseInt(-valor),
                "descricao": descricao,
                "isCredit": false
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
import db from '../database.js'
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export async function loadRegisters(req, res) {
    const token = res.locals.token;
  
    try {
        const session = await db.collection("session").findOne({ token });
       
        const registers = await db.collection('registers').find({ registerUserId: new ObjectId(session.userId) }).toArray();

        res.status(200).send(registers);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500)    
    }
};

export async function newEntry(req, res) {

    const { value , description } = req.body;
    const token = res.locals.token;

    try {
        const session = await db.collection("session").findOne({ token });
       
        const time = dayjs().locale('pt-br').format('DD/MM');

        await db.collection('registers').insertOne(
            {
                "value": Number(value),
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
};

export async function newExit(req, res) {
 
    const { value , description } = req.body;
    const token = res.locals.token;

    try {
        const session = await db.collection("session").findOne({ token });
      
        const time = dayjs().locale('pt-br').format('DD/MM');

        await db.collection('registers').insertOne(
            {
                "value": -Math.abs(value),
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
};
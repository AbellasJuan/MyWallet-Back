import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { stripHtml } from 'string-strip-html';
import db from '../database.js'

export async function signUp(req, res) {
    const {name, email, password} = req.body;

    const userEmail = await db.collection('users').findOne({ email });
    const userName = await db.collection('users').findOne({ name });

    if (userEmail || userName){
        return res.sendStatus(400);
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
    }catch (error) {
       console.error(error);
       res.sendStatus(500);
    }
};

export async function signIn(req, res) {
    const { email, password } = req.body;
  
    try {
      
        const user = await db.collection('users').findOne({ email: email });
       
        if (!user) {
            return res.sendStatus(404);
        }
        
        if(bcrypt.compareSync(password, user.password)) {
          const token = uuid();
          await db.collection("session").insertOne({ token, userId: user._id, userName: user.name });
          const loggedUser = await db.collection('session').findOne({ userName: user.name });
          return res.status(200).send(loggedUser);
        }  

        res.sendStatus(401);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
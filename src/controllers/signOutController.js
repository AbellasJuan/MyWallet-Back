import db from '../database.js'

export async function signOut(req, res){
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');

    try{
        await db.collection("session").deleteOne({token});
        return res.sendStatus(200);
    }catch (erro) {
        console.log(erro);
        res.sendStatus(500);
    }
};
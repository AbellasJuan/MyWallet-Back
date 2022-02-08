import db from '../database.js'

export async function signOut(req, res){
    const token = res.locals.token;
    
    try{
        await db.collection("session").deleteOne({token});
        return res.sendStatus(200);
    }catch (erro) {
        console.log(erro);
        res.sendStatus(500);
    }
};
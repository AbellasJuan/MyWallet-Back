import db from '../database.js'

export async function authMiddleware(req, res, next){
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

      res.locals.token = token;

      next();
    } catch (error) { 
      console.log(error);
      return res.sendStatus(500);
    }
}
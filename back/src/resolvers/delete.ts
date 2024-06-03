import { PeliculaSchema } from '../db/schemas.ts';
import { pelisCollection, usersCollection } from "../db/mongo.ts";
import { ObjectId } from 'https://deno.land/x/web_bson@v0.2.5/mod.ts';
import { Request, Response } from "express";
import { Payload } from "djwt";
import { createJWT, verifyJWT } from "../utils/jwt.ts";

;
export const deletePeli = async(req: Request, res: Response) => {

    try{
        const {_id} = req.params;
        const {auth} = req.body;
        if(_id && auth){
            const user: Payload = await verifyJWT(auth,Deno.env.get("JWT_SECRET")!);

            if(!user.username){
              const data = {
                message: "bad",
              };
              res.status(500).send(data);
              return;
            }
            console.log("User deleting: ", user)

            

            const peli: PeliculaSchema | undefined = await pelisCollection.findOne({
                _id: new ObjectId(_id),
            });
            console.log("Peli deleting: ",peli);
            if(peli){
                console.log("Peli id deleting: ",peli._id)
        
                if(Array.isArray(user.peliculas)){
                const found = user.peliculas.includes(peli._id.toString())
                console.log("Pelis of user deleting: ",user.peliculas)
                console.log("Fouinded: ",found)
                if(found){
                  const newPelis  = user.peliculas.filter((id) => id !== peli._id.toString())
                  const ObjectIdArr = newPelis.map((id: string) => { return new ObjectId(id)})
                  console.log("Mis neew pelis deleting",ObjectIdArr)
                  await usersCollection.updateOne({username: user.username!} , {$set : {peliculas: ObjectIdArr}});
                  const newUser = await usersCollection.findOne({username: user.username!})
                  const newAuth = await createJWT(newUser!,Deno.env.get("JWT_SECRET")!)
                  res.status(200).send({message: "User updated!" , body: newUser, auth: newAuth})
                  return;
                }
                res.status(203).send({message: "Film already got"})
                return;
                }   
              }
            else{
                res.status(404).send({message:"Not found"})
                return;
        }
        }
        res.status(400)
        return;
    }catch(e){
        res.status(500).send("Error: ",e)
        return;
    }
}

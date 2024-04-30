import { PeliculaSchema } from '../db/schemas.ts';
import { pelisCollection } from "../db/mongo.ts";
import { ObjectId } from 'https://deno.land/x/web_bson@v0.2.5/mod.ts';
import { Request, Response } from "express";

;
export const deletePeli = async(req: Request, res: Response) => {

    try{
        const {_id} = req.params;
        if(_id){
            const Peli: PeliculaSchema | undefined = await pelisCollection.findOne({
                _id: new ObjectId(_id),
            });
            console.log(Peli);
            if(Peli){
                await pelisCollection.deleteOne({_id : new ObjectId(_id)});
                res.status(200).send("Deleted successfully")
            }
            else{
                res.status(404).send("Not found")
        }
        }
        res.status(400)
    }catch(e){
        res.status(500).send("Error: ",e)
    }
}

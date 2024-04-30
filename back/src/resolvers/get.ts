import { pelisCollection } from "../db/mongo.ts";
import { Pelicula } from '../types.ts';
import { PeliculaSchema } from '../db/schemas.ts';
import { Request, Response } from "express";



export const getPelis = async(_req: Request, res: Response) => {
    try {
        const peliDB   = await pelisCollection.find((peli:Pelicula) => {return peli}).toArray()
        res.status(200).send(peliDB)
    }catch(e){
        res.status(500).send(e)
    }
}

export const getPelisTipos = async(req: Request, res: Response) => {
    try{
        const {tipo} = req.params
        if(tipo){
        const peliDB :PeliculaSchema[] = await pelisCollection.find({tipo: tipo}).toArray();
        console.log(peliDB);
        if(peliDB){
        res.status(200).send(peliDB)
        return;
        }
        }
        res.status(404)
    }catch(e){
        res.status(500).send(e)
        
    }
}

export const getPeli = async(req: Request, res: Response) => {

    try{
        const {name} = req.params
        if(name){
            const Peli: PeliculaSchema | undefined = await pelisCollection.findOne({
                name: name,
            });
            console.log(Peli)
            if(Peli){
                res.status(200).send(Peli)
                return ;
            }
        }
        res.status(404).send("Not found")
    }catch(e){
        res.status(500).send(e)
    }
}


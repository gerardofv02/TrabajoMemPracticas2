import { pelisCollection, usersCollection } from "../db/mongo.ts";
import { Pelicula } from "../types.ts";
import { PeliculaSchema } from "../db/schemas.ts";
import { Request, Response } from "express";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import {verifyJWT} from "../utils/jwt.ts"
import { Payload } from "djwt";

export const getPelis = async (_req: Request, res: Response) => {
  try {
    const peliDB = await pelisCollection.find((peli: Pelicula) => {
      return peli;
    }).toArray();
    res.status(200).send(peliDB);
  } catch (e) {
    res.status(500).send(e);
  }
};
export const getPelisUser = async (req: Request, res: Response) => {
  try {
    console.log("dasasd")
    const { auth } = req.params;
    console.log("Auth: ", auth);
    if(!auth){
      res.status(404).send({message: "Auth not given"})
    }

    const payload :Payload = await verifyJWT(auth, Deno.env.get("JWT_SECRET")!)
    console.log(payload)

    const user = await usersCollection.findOne({ username: payload.username! });
    console.log(user);
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const misPeliculas = user.peliculas;

    const pelisPromises: Promise<PeliculaSchema | undefined>[] = misPeliculas.map(
      async (p: ObjectId) => {
        console.log("p: ", p);
        const peli = await pelisCollection.findOne({ _id: p });
        console.log("peli: ", peli);
        return peli;
      },
    );
    const peliDB = await Promise.all(pelisPromises);

    console.log("Mispelis de user", peliDB);
    if (peliDB.length === 0) {
      res.status(404).send({ message: "Pelis not found" });
    }
    res.status(200).send(peliDB);
  } catch (e) {
    res.status(500).send({ message: e });
  }
};

export const getPelisTipos = async (req: Request, res: Response) => {
  try {
    const { tipo } = req.params;
    if (tipo) {
      const peliDB: PeliculaSchema[] = await pelisCollection.find({
        tipo: tipo,
      }).toArray();
      console.log(peliDB);
      if (peliDB) {
        res.status(200).send(peliDB);
        return;
      }
    }
    res.status(404);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const getPeli = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    if (name) {
      const Peli: PeliculaSchema | undefined = await pelisCollection.findOne({
        name: name,
      });
      console.log(Peli);
      if (Peli) {
        res.status(200).send(Peli);
        return;
      }
    }
    res.status(404).send("Not found");
  } catch (e) {
    res.status(500).send(e);
  }
};

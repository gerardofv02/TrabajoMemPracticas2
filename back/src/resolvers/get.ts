import { pelisCollection, usersCollection } from "../db/mongo.ts";
import { Pelicula } from "../types.ts";
import { PeliculaSchema } from "../db/schemas.ts";
import { Request, Response } from "express";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { verifyJWT } from "../utils/jwt.ts";
import { Payload } from "djwt";

export const getPelis = async (_req: Request, res: Response) => {
  try {
    const peliDB = await pelisCollection.find((peli: Pelicula) => {
      return peli;
    }).toArray();
    res.status(200).send(peliDB);
    return;
  } catch (e) {
    res.status(500).send(e);
    return;
  }
};
export const getPelisUser = async (req: Request, res: Response) => {
  try {
    //console.log("dasasd");
    const { auth } = req.params;
    //console.log("Auth: ", auth);
    if (!auth) {
      res.status(404).send({ message: "Token no dado" });
      return;
    }

    const payload: Payload = await verifyJWT(auth, Deno.env.get("JWT_SECRET")!);
    //console.log("Mi payload es este: ", payload);

    const user = await usersCollection.findOne({ username: payload.username! });
    //console.log(user);
    if (!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
      return;
    }
    const misPeliculas = user.peliculas;

    const pelisPromises: Promise<PeliculaSchema | undefined>[] = misPeliculas
      .map(
        async (p: ObjectId) => {
          const peli = await pelisCollection.findOne({ _id: p });
          //console.log("peli finding: ", peli);
          return peli;
        },
      );
    const peliDB = await Promise.all(pelisPromises);

    //console.log("Mispelis de user", peliDB);
    if (peliDB.length === 0) {
      res.status(404).send({ message: "No se han encontrado películas" });
      return;
    }
    res.status(200).send(peliDB);
    return;
  } catch (e) {
    res.status(500).send({ message: e });
    return;
  }
};

export const getPelisTipos = async (req: Request, res: Response) => {
  try {
    const { tipo, auth } = req.params;
    if (!auth) {
      res.status(405).send({ message: "No se ha iniciado sesión" });
      return;
    }
    //console.log(tipo, auth);

    const payload: Payload = await verifyJWT(auth, Deno.env.get("JWT_SECRET")!);
    //console.log("Mi payload es este: ", payload);

    const user = await usersCollection.findOne({ username: payload.username! });
    //console.log(user);
    if (!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
      return;
    }

    if (tipo) {
      const misPeliculas = user!.peliculas;
      const pelisPromises: Promise<PeliculaSchema | undefined>[] = misPeliculas
        .map(
          async (p: ObjectId) => {
            const peli = await pelisCollection.findOne({ _id: p });
            //console.log("peli finding: ", peli);
            return peli;
          },
        );
      const peliParaFiltrar = await Promise.all(pelisPromises);
      //console.log("PELIS PARA FILTRAR: ", peliParaFiltrar);
      if (!peliParaFiltrar) {
        res.send(404).status({ message: "No tienes películas" });
        return;
      }
      const peliDB: (PeliculaSchema | undefined)[] = peliParaFiltrar.filter((
        pe,
      ) => pe!.tipo === tipo);
      //console.log("PELIS FIKTRADAS: ", peliDB);
      if (peliDB) {
        res.status(200).send(peliDB);
        return;
      }
    }
    res.status(404).send({ message: "No hay tipo elegido" });
    return;
  } catch (e) {
    res.status(500).send(e);
    return;
  }
};

export const getPeli = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    if (name) {
      const Peli: PeliculaSchema | undefined = await pelisCollection.findOne({
        name: name,
      });
      //console.log(Peli);
      if (Peli) {
        res.status(200).send(Peli);
        return;
      }
    }
    res.status(404).send({ message: "No encontrada" });
    return;
  } catch (e) {
    res.status(500).send({ message: e });
    return;
  }
};

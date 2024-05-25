import { PeliculaSchema, UserSchema } from "../db/schemas.ts";
import { pelisCollection, usersCollection } from "../db/mongo.ts";
import { createJWT, verifyJWT } from "../utils/jwt.ts";
import * as bcrypt from "bcrypt";
import { Usuario } from "../types.ts";
import { Request, Response } from "express";

export const addPeli = async (req: Request, res: Response) => {
  try {
    const { tipo, name, valoracion, duracion, image, comentarios } = req.body;

    if (
      !tipo || !name || !valoracion || !duracion
    ) {
      res.status(400);
      return;
    } else {
      const peli = await pelisCollection.findOne({ name });
      if (!peli) {
        const pelicula = {
          name: name,
          tipo: tipo,
          valoracion: valoracion,
          duracion: duracion,
          image: image,
          comentarios: comentarios,
        };
        await pelisCollection.insertOne(pelicula as PeliculaSchema);
        res.status(200).send({
          message: "Peli insertado correctamente en la base de datos",
          name: pelicula.name,
          tipo: pelicula.tipo,
          valoracion: pelicula.valoracion,
        });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log("Username: ", username, "PAssword: ", password)
    if (!username || !password) {
      res.status(404).send({message: "Need values"});
      return;
    }
    const hash = await bcrypt.hash(password);
    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(404).send({ message: "Incorrect Password" });
      return;
    }
    const token = await createJWT({
      username: user.username,
      password: hash,
      correo: user.correo,
      peliculas: user.peliculas,
    }, Deno.env.get("JWT_SECRET")!);
    console.log("JEJE ");
    res.status(200).send({ message: token });
  } catch (e) {
    res.status(500).send(e);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, correo } = req.body;
    if (!correo || !username || !password) {
      res.status(400).send("need values");
      return;
    }
    const user = await usersCollection.findOne({ correo: correo });
    if (user) {
      res.status(500).send("User already created");
      return;
    }
    const hash = await bcrypt.hash(password);
    const usuario: Usuario = {
      username: username,
      password: hash,
      correo: correo,
      peliculas: [],
    };
    const token = await createJWT(usuario, Deno.env.get("JWT_SECRET")!);
    res.status(200).send({ token: token, message: "User created correctly" });
    await usersCollection.insertOne(usuario as UserSchema);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const verifyLoaded = async (req: Request, res: Response) => {
  try {
    const { auth } = req.body;
    if (!auth) {
      console.log("Not logged case");
      const data = {
        message: "Not logged",
      };
      res.status(500).send(data);
    } else {
      const user = await verifyJWT(auth, Deno.env.get("JWT_SECRET")!);
      console.log(user);
      if (!user.username!) {
        const data = {
          message: "bad",
        };
        res.status(500).send(data);
      } else {
        const data = {
          message: "Nice",
          body: user,
        };
        console.log("Data good paso por aqui", data);
        res.status(200).send(data);
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

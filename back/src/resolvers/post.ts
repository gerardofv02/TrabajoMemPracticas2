// deno-lint-ignore-file
import { PeliculaSchema, UserSchema } from "../db/schemas.ts";
import { pelisCollection, usersCollection } from "../db/mongo.ts";
import { createJWT, verifyJWT } from "../utils/jwt.ts";
import * as bcrypt from "bcrypt";
import { Usuario } from "../types.ts";
import { Request, Response } from "express";
import { Payload } from "djwt";
import { ObjectId } from "mongo";

export const addPeli = async (req: Request, res: Response) => {
  try {
    const { tipo, name, valoracion, duracion, image, comentarios, auth } =
      req.body;

    if (
      !tipo || !name || !valoracion || !duracion || !auth
    ) {
      res.status(400);
      return;
    } else {
      const user: Payload = await verifyJWT(auth, Deno.env.get("JWT_SECRET")!);
      //console.log("User before doing nothiong posting peli: ",user)

      if (!user.username!) {
        const data = {
          message: "Mala autenticación",
        };
        res.status(500).send(data);
        return;
      }

      const peli: PeliculaSchema | undefined = await pelisCollection.findOne({
        name,
      });

      if (peli) {
        if (Array.isArray(user.peliculas)) {
          const found = user.peliculas.includes(peli._id.toString());
          //console.log("Peliculas de user añadiendo: ",user.peliculas)
          //console.log("Myuser",user)
          //console.log("Fouinded: ",found)
          if (!found) {
            const ObjectIdArr = user.peliculas.map((id: string) => {
              return new ObjectId(id);
            });
            ObjectIdArr.push(peli._id);
            peli.valoracion.push(Number(valoracion));
            if (comentarios) {
              peli.comentarios.push(comentarios);
            }
            peli.duracion.push(Number(duracion));
            //console.log("ObjetctIdArr not found and peli exists: ", ObjectIdArr);
            //console.log("Peli valoracion after adding new valoracion: ", peli.valoracion);
            await usersCollection.updateOne({ username: user.username! }, {
              $set: { peliculas: ObjectIdArr },
            });
            await pelisCollection.updateOne({ name: peli.name }, {
              $set: {
                valoracion: peli.valoracion,
                comentarios: peli.comentarios,
                duracion: peli.duracion,
              },
            });
            const newUser = await usersCollection.findOne({
              username: user.username!,
            });
            //console.log("New User peli not faound but exists: " , newUser)
            const newAuth = await createJWT(
              newUser!,
              Deno.env.get("JWT_SECRET")!,
            );
            //console.log("New auth peli not found but exists: ", newAuth)
            res.status(200).send({
              message: "Usuario actualizado",
              body: newUser,
              auth: newAuth,
            });
            return;
          }
          res.status(203).send({
            message: "La película ya estaba en el listado",
          });
          return;
        }
      }
      if (!peli) {
        const pelicula = {
          name: name,
          tipo: tipo,
          valoracion: [Number(valoracion)],
          duracion: [Number(duracion)],
          image: image,
          comentarios: [comentarios],
        };
        //console.log("Los comentarios son: ", comentarios);
        if (!comentarios) {
          pelicula.comentarios = [];
        }

        const x = await pelisCollection.insertOne(pelicula as PeliculaSchema);
        if (Array.isArray(user.peliculas)) {
          const found = user.peliculas.includes(x.toString());
          //console.log("Peliculas de user",user.peliculas)
          //console.log("Myuser",user)
          //console.log("Fouinded: ",found)
          if (!found) {
            const ObjectIdArr = user.peliculas.map((id: string) => {
              return new ObjectId(id);
            });
            ObjectIdArr.push(x);
            //console.log("List to push of object ID: ",ObjectIdArr)
            const y = await usersCollection.updateOne({
              username: user.username!,
            }, { $set: { peliculas: ObjectIdArr } });
            //console.log("Adding a film: ", y)
            const newUser = await usersCollection.findOne({
              username: user.username!,
            });
            const newAuth = await createJWT(
              newUser!,
              Deno.env.get("JWT_SECRET")!,
            );
            res.status(200).send({
              message: "Usuario aztualizado",
              body: newUser,
              auth: newAuth,
            });
            return;
          }
          res.status(203).send({
            message: "La película ya estaba en el listado",
          });
          return;
        }
        res.status(200).send({
          message: "Peli insertado correctamente en la base de datos",
          name: pelicula.name,
          tipo: pelicula.tipo,
          valoracion: pelicula.valoracion,
        });
        return;
      }
    }
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    //console.log("Username: ", username, "PAssword: ", password)
    if (!username || !password) {
      res.status(404).send({ message: "Se necesitan variables" });
      return;
    }
    const hash = await bcrypt.hash(password);
    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      res.status(404).send({ message: "Usuario no encontrado" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(404).send({ message: "Contraseña incorrecta" });
      return;
    }
    const token = await createJWT({
      username: user.username,
      password: hash,
      correo: user.correo,
      peliculas: user.peliculas,
    }, Deno.env.get("JWT_SECRET")!);
    //console.log("JEJE ");
    res.status(200).send({ message: token });
    return;
  } catch (e) {
    res.status(500).send(e);
    return;
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, correo } = req.body;
    if (!correo || !username || !password) {
      res.status(400).send({ message: "Se necesitan variables" });
      return;
    }
    const symbols = ["!", "?", "¡", "'", "$", "&", "/"];
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let contains = false;
    symbols.map((symbol) => {
      if (password.includes(symbol)) {
        contains = true;
      }
    });
    if (!contains) {
      res.status(400).send({
        message:
          "La contraseña debe tener al menos uno de los siguientes: '!','?','¡',''','$','&' or '/'",
      });
      return;
    }
    contains = false;
    numbers.map((number) => {
      if (password.includes(number)) {
        contains = true;
      }
    });
    if (!contains) {
      res.status(400).send({
        message: "La contraseña debe tener al menos un número",
      });
      return;
    }
    contains = false;

    if (password.length > 6) {
      contains = true;
    }

    if (!contains) {
      res.status(400).send({
        message: "La contraseña debe ser de al menos 7 caráteres",
      });
      return;
    }

    var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

    if (!validEmail.test(correo)) {
      res.status(400).send({ message: "Correo no es válido" });
      return;
    }

    const userCorreo = await usersCollection.findOne({ correo: correo });
    //console.log(userCorreo);
    if (userCorreo) {
      res.status(500).send({ message: "Ese correo ya está en uso" });
      return;
    }
    const userUsername = await usersCollection.findOne({ username: username });
    if (userUsername) {
      res.status(500).send({ message: "Nombre de usuario ya en uso" });
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
    await usersCollection.insertOne(usuario as UserSchema);
    res.status(200).send({
      token: token,
      message: "Usuario creado correctamente",
    });
    return;
  } catch (e) {
    res.status(500).send({ message: e });
    return;
  }
};

export const verifyLoaded = async (req: Request, res: Response) => {
  try {
    const { auth } = req.body;
    if (!auth) {
      //console.log("Not logged case");
      const data = {
        message: "No ha iniciado sesión",
      };
      res.status(500).send(data);
      return;
    } else {
      const user = await verifyJWT(auth, Deno.env.get("JWT_SECRET")!);
      //console.log(user);
      if (!user.username) {
        const data = {
          message: "Usuario no encontrado",
        };
        res.status(500).send(data);
        return;
      } else {
        const data = {
          message: "Bien",
          body: user,
        };
        //console.log("Data good paso por aqui", data);
        res.status(200).send(data);
        return;
      }
    }
  } catch (e) {
    res.status(500).send({ message: e });
    return;
  }
};

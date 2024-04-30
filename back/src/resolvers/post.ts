import { PeliculaSchema ,UserSchema} from "../db/schemas.ts";
import { pelisCollection, usersCollection } from "../db/mongo.ts";
import { createJWT,verifyJWT } from "../utils/jwt.ts";
import * as bcrypt from "bcrypt";
import { Usuario } from "../types.ts";
import { Request, Response } from "express";



export const addPeli = async (req: Request, res: Response) => {
  try {
    const {tipo,name,valoracion,duracion, image,comentarios} = req.body;

    if (
      !tipo || !name || !valoracion || !duracion
    ) {
     res.status(400)
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
        res.status(200).send( {
          message: "Peli insertado correctamente en la base de datos",
          name: pelicula.name,
          tipo: pelicula.tipo,
          valoracion: pelicula.valoracion,
        }) 
      }
    }
  } catch (error) {
    res.status(500).send(error)
  }
};

export const login = async (req: Request, res: Response) => {
  try{


    const {username, password} = req.body;
    if(!username|| !password){
      res.status(404).send("Need values")
      return;
    }
    const hash = await bcrypt.hash(password);
    const user = await usersCollection.findOne({username: username});
    if(!user){
      res.status(404).send("User not found")
      return;
    }
    const token = await createJWT({
      username: user.username,
      password : hash,
      correo: user.correo
  },
      Deno.env.get("JWT_SECRET")!
  );
  res.status(200).send( {token: token}); 


  }catch(e){
    res.status(500).send(e)
  }
}

export const createUser = async (req: Request, res:Response)=> {
  try{
    const {username, password, correo} = req.body;
    if(!correo || !username || !password){
      res.status(400).send("need values")
      return;
    }
    const user = await usersCollection.findOne({correo: correo});
    if(user){
      res.status(500).send("User already created")
      return;
    }
    const hash = await bcrypt.hash(password);
    const usuario : Usuario= {
      username: username,
      password: hash,
      correo: correo
    }
    const token = await createJWT(usuario,
      Deno.env.get("JWT_SECRET")!
  );
  res.status(200).send({token: token, message:"User created correctly"})
    await usersCollection.insertOne(usuario as UserSchema);

  }catch(e){
    res.status(500).send(e)
  }
}

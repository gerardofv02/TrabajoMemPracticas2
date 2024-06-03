import { Pelicula, Usuario } from "../types.ts";
import { ObjectId } from "mongo";

export type PeliculaSchema = Omit<Pelicula, "pelicula"> & {
  _id: ObjectId;
  name: string;
  valoracion:number[];
  tipo: string;
  duracion: number[];
  pelicula: string;
  comentarios: string[];
  plataforma: string;
};

export type UserSchema = Omit<Usuario, "usuario"> & {
  _id: ObjectId;
  username: string;
  password: string;
  correo: string;
  peliculas: ObjectId[];
};

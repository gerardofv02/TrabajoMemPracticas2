import { Pelicula } from "../types.ts";
import { ObjectId } from "mongo";

export type PeliculaSchema = Omit<Pelicula, "pelicula"> & {
  _id: ObjectId;
  name: string,
  tipo: string,
  duracion: number,
  pelicula: string,
  comentarios: string,
  plataforma: string,
};

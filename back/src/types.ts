import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

export type Pelicula = {
  tipo: string;
  name: string;
  valoracion: number;
  duracion: number;
  image: string;
  comentarios: string;
  platadorma: string;
};

export type Usuario = {
  username: string;
  password: string;
  correo: string;
  peliculas: ObjectId[];
};

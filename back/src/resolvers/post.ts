import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { PeliculaSchema } from "../db/schemas.ts";
import { pelisCollection } from "../db/mongo.ts";

type PostPeliContext = RouterContext<
  "/addPeli",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const addPeli = async (context: PostPeliContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    if (
      !value?.tipo || !value?.name || !value?.valoracion || !value?.duracion
    ) {
      context.response.status = 400;
      return;
    } else {
      const peli = await pelisCollection.findOne({ ...value });
      if (!peli) {
        const pelicula = {
          name: value.name,
          tipo: value.tipo,
          valoracion: value.valoracion,
          duracion: value.duracion,
          image: value.image,
          comentarios: value.comentarios,
        };
        await pelisCollection.insertOne(pelicula as PeliculaSchema);
        context.response.body = {
          message: "Peli insertado correctamente en la base de datos",
          name: pelicula.name,
          tipo: pelicula.tipo,
          valoracion: pelicula.valoracion,
        };
      }
    }
  } catch (error) {
    context.response.status = 404;
    context.response.body = {
      message: "No se ha podido añadir el usuario a la base de datos",
      error: error,
    };
  }
};

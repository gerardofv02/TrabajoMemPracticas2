
import { RouterContext } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { pelisCollection } from "../db/mongo.ts";
import { Pelicula } from '../types.ts';
import { PeliculaSchema } from '../db/schemas.ts';
type GetPelisContext = RouterContext<
  "/getPelisTipo/:tipo",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetPeliContext = RouterContext<

"/getPeli/:name", {
    name: string;
  } & Record<string | number, string | undefined>, 
  Record<string, any>

>
;


export const getPelis = async(context:any) => {
    try {
        const peliDB   = await pelisCollection.find((peli:Pelicula) => {return peli}).toArray()
        context.response.body = {
          peliDB,
        }
    }catch(e){
        context.response.body = {

                message: "Error:",

            e
        }
    }
}

export const getPelisTipos = async(context: GetPelisContext):Promise<PeliculaSchema[]|undefined> => {
    try{
        if(context.params?.tipo){
        const peliDB :PeliculaSchema[] = await pelisCollection.find({tipo: context.params.tipo}).toArray();
        console.log(peliDB);
        if(peliDB){
        context.response.body = {
            peliDB,
        }
          return peliDB;
        }
        }
        context.response.status = 404;
    }catch(e){
        context.response.body = {

                message: "Error:",

            e
        }
        
    }
}

export const getPeli = async(context : GetPeliContext) => {

    try{
        if(context.params?.name){
            const Peli: PeliculaSchema | undefined = await pelisCollection.findOne({
                name: context.params.name,
            });
            if(Peli){
                context.response.body= {
                    Peli,
                }
                return ;
            }
        }
        context.response.status = 404;
    }catch(e){
        context.response.status = 404;
        context.response.body = {

                message: "Error:",

            e
        }
    }
}


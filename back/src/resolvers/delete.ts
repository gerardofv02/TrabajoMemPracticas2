import { RouterContext } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { PeliculaSchema } from '../db/schemas.ts';
import { pelisCollection } from "../db/mongo.ts";
import { ObjectId } from 'https://deno.land/x/web_bson@v0.2.5/mod.ts';
type deletePeliContext = RouterContext<

"/deletePeli/:_id", {
    _id: string;
  } & Record<string | number, string | undefined>, 
  Record<string, any>

>
;
export const deletePeli = async(context : deletePeliContext) => {

    try{
        console.log(context.params._id);
        if(context.params?._id){
            const Peli: PeliculaSchema | undefined = await pelisCollection.findOne({
                _id: new ObjectId(context.params._id),
            });
            console.log(Peli);
            if(Peli){
                await pelisCollection.deleteOne({_id : new ObjectId(context.params._id)});
                context.response.body= {
                    message: "Eliminado corrrectamente",
                
                }
                context.response.status = 200;
            }
            else{
            context.response.status = 404;
            context.response.body = {
                message:"No encontrada"
            }
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

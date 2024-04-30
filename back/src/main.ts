import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getPeli, getPelis, getPelisTipos } from "./resolvers/get.ts";
import { addPeli, createUser, login } from "./resolvers/post.ts";
import { deletePeli } from "./resolvers/delete.ts";
import express from "npm:express@4.18.2";
import cors from "cors";




const miapp = express();
miapp.use(express.json());
miapp.use(cors())
miapp
  .get("/getPelis", getPelis)
  .get("/getPelisTipos/:tipo", getPelisTipos)
  .get("/getPeli/:name", getPeli)
  .post("/addPeli", addPeli)
  .delete("/deletePeli/:_id", deletePeli)
  .post("/createUser",createUser)
  .post("/login" , login);



miapp.listen(3000, (): void => {
  console.log("Sever ready on: http://localhost:3000/");
});
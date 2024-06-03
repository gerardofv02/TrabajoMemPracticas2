import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import {
  getPeli,
  getPelis,
  getPelisTipos,
  getPelisUser,
} from "./resolvers/get.ts";
import { addPeli, createUser, login, verifyLoaded } from "./resolvers/post.ts";
import { deletePeli } from "./resolvers/delete.ts";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";

const miapp = express();

miapp.use(express.json());
miapp.use(cors());
miapp
  .get("/getPelis", getPelis)
  .get("/getPelisTipos/:tipo/:auth", getPelisTipos)
  .get("/getPeli/:name", getPeli)
  .post("/addPeli", addPeli)
  .delete("/deletePeli/:_id", deletePeli)
  .post("/createUser", createUser)
  .post("/login", login)
  .post("/verifyLoaded", verifyLoaded)
  .get("/getPelisUser/:auth", getPelisUser);

miapp.listen(3000, (): void => {
  console.log("Sever ready on: http://localhost:3000/");
});

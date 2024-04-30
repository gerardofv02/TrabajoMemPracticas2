// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $index from "./routes/index.tsx";
import * as $listado from "./routes/listado.tsx";
import * as $tipos_tipo_ from "./routes/tipos/[tipo].tsx";
import * as $Peliculas from "./islands/Peliculas.tsx";
import * as $Tipos from "./islands/Tipos.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/index.tsx": $index,
    "./routes/listado.tsx": $listado,
    "./routes/tipos/[tipo].tsx": $tipos_tipo_,
  },
  islands: {
    "./islands/Peliculas.tsx": $Peliculas,
    "./islands/Tipos.tsx": $Tipos,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;

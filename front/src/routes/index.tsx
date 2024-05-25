import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: (_req: Request, ctx: FreshContext) => {
    return new Response("", {
      headers: {
        location: "/listado",
      },
      status: 303
    })
  }
}

export default function Home() {
  return (
    <div>
      <h1>Bienvenido a PeliculasGuardar</h1>
      <h2>Que desea ahcer?</h2>
      <button><a href="/login">Ir a login</a></button>
      <button><a href="/createUser">Crear una cuenta</a></button>
    </div>
  );
}

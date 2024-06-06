import { FreshContext, Handler } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import jwt from "jsonwebtoken";
export const handler: Handler = async (req: Request, ctx: FreshContext) => {
  if (ctx.destination !== "route") {
    const res = await ctx.next();
    return res;
  }
  ////console.log("Hola");

  if (ctx.route === "/login") {
    const res = await ctx.next();
    ////console.log("jeje");
    return res;
  }
  ////console.log("Estoy");
  if (ctx.route === "/createUser") {
    const res = await ctx.next();
    ////console.log("jiji");
    return res;
  }
  ////console.log("Estoy create")
  const cookies = getCookies(req.headers);
  const auth = cookies.auth;
  ////console.log("Auth: ", auth);
  if (!auth) {
    return new Response("", {
      status: 307,
      headers: { location: "/login" },
    });
  }

  const mybody = {
    auth: auth,
  };

  //REOCRDAR LO DEL HEDARES
  const verify = await fetch(`http://back:3000/verifyLoaded`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mybody),
  });

  ////console.log(verify.status);

  const verRes = await verify.json();

  if (verify.status !== 200) {
    return new Response(verRes.message, {
      status: 307,
      headers: {
        location: "/login",
      },
    });
  }

  ////console.log("He llegado al final y esta todo bien");

  // const payload = jwt.verify(auth, "mysupersecret");
  const res = await ctx.next();
  ////console.log("route: ", ctx.route);
  return res;
};

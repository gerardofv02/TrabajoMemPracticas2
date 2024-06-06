import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { useEffect, useState } from "preact/hooks";
import { pelicula } from "../../types.ts";
import Peli from "../../islands/Peli.tsx";

// export const handler: Handlers = {
//     GET: async (_req: Request, ctx: FreshContext) => {
//         const { name } = ctx.params;
//         const res = await fetch(`http://back:3000/getPeli/${name}`);
//         const body = await res.json();
//         //console.log(body)
//         if (res.status === 404) {
//             return new Response("", {
//                 headers: {
//                     location: "/404",
//                 },
//                 status: 303
//             })
//         }
//         if (res.status !== 200) {
//             return ctx.render({ message: body })
//         }
//         return ctx.render({ peli: body })
//     }
// }

const Page = (props: PageProps) => {
  const { name } = props.params;
  //console.log(name)
  return (
    <div>
      <Peli key={name} name={name}></Peli>
    </div>
  );
};

export default Page;

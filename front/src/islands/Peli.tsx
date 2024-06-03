import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { useEffect, useState } from "preact/hooks";
import { pelicula } from "../types.ts";
import { FunctionComponent } from "preact";

type csrProps = {
    name: string;
};

// export const handler: Handlers = {
//     GET: async (_req: Request, ctx: FreshContext) => {
//         const { name } = ctx.params;
//         const res = await fetch(`http://back:3000/getPeli/${name}`);
//         const body = await res.json();
//         console.log(body)
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

const Peli: FunctionComponent<csrProps> = (props) => {
    console.log("Hola estoy aki")
    const [data, setData] = useState<pelicula>()

    const [error, setError] = useState<{ message: string }>()

    const [media, setMedia] = useState<number>(0)

    const [duracion_media, setDuracion] = useState<number>(0);

    const name = props.name

    const getData = async () => {
        console.log("MINAME: ", name)
        const res = await fetch(`http://localhost:3000/getPeli/${name}`, {
            method: "GET"
        });

        const body = await res.json();
        console.log(body)
        if (res.status === 404) {
            return new Response("", {
                headers: {
                    location: "/404",
                },
                status: 303
            })
        }
        if (res.status !== 200) {
            setError({ message: body })
        }
        const suma = body.valoracion.reduce((acc: number, val: number) => acc + val, 0);
        const suma_duracion = body.duracion.reduce((acc: number, val: number) => acc + val, 0);

        setMedia(suma / body.valoracion.length);
        setDuracion(suma_duracion / body.duracion.length)
        setData(body)
        console.log("SUM: ", suma, "Media: ", media, "ARR VALORACIONES: ", body.valoracion)
    }

    useEffect(() => {
        try {
            getData();
            console.log("XD")
        } catch (e) {
            setError({ message: e })
        }
    }, []);
    console.log("XDD")

    return (
        <div>
            <div>{error && error.message}</div>
            <a href="/listado"><button class="arriba-izquierda">Volver a listado</button></a>
            {data && <>
                <div>Name: <strong>{data.name}</strong></div>
                <div>Image: <img src={data.image} alt={`${data.name} image`}></img></div>
                <div>Type: {data.tipo}</div>
                <div>Valoración: {media && media}</div>
                <div>Duración: {duracion_media && duracion_media}</div>
                <ul>Comentarios: {data.comentarios.map((comentario) => {
                    return (
                        <li>{comentario}</li>
                    )
                })}</ul>
            </>
            }
        </div>
    )

}


export default Peli;
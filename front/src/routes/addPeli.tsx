import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
    POST: async (req: Request, ctx: FreshContext) => {
        try {
            console.log("Aqui estoy antes de obtener form")
            const form = await req.formData()
            const name = form.get("name");
            console.log("Name: ", name)
            const image = form.get("imagen");
            console.log("Imagen :", image)
            const tipo = form.get("tipos");
            console.log("Tipos: ", tipo)
            const plataforma = form.get("plataformas");
            console.log("platamforma: ", plataforma)
            const valoracion = form.get("valoracion");
            console.log("valoracion:", valoracion)
            const duracion = form.get("duracion");
            console.log("Duracion: ", duracion)
            const comentarios = form.get("comentarios");
            console.log("COmentarios", comentarios);

            if (!duracion || !plataforma || !name || !tipo || !valoracion) {
                return ctx.render({ message: "Faltan datos por poner" })
            }

            if (Number(valoracion) < 0 || Number(valoracion) > 10) {
                return ctx.render({ message: "Valoracion debe ser entre 0 y 10" })
            }

            const { auth } = getCookies(req.headers);


            console.log("Aqui estoy antes de peticion")

            const response = await fetch(`http://back:3000/addPeli`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "Application/json"
                    },
                    body: JSON.stringify({ name, image, tipo, plataforma, valoracion, duracion, comentarios, auth: auth }),
                }
            )
            console.log("Aqui estoy dsps de peticion")
            const body = await response.json();
            console.log(response)
            console.log(body)
            if (response.status === 200) {
                const headers = new Headers();
                const url = new URL(req.url)
                setCookie(headers, {
                    name: "auth",
                    value: body.auth,
                    sameSite: "Lax", // this is important to prevent CSRF attacks
                    domain: url.hostname,
                    path: "/",
                    secure: true,
                });

                headers.set("location", "/listado");
                console.log("Aqui llego perfectamente");

                return new Response(null, {
                    status: 303,
                    headers: headers,
                });
            } else {
                return ctx.render({ message: body.message })
            }


        } catch (e) {
            return ctx.render({ message: e })
        }

    }
}

const Page = (props: PageProps<{ message: string }>) => {
    return (
        <div>
            <a href="/listado"><button class="arriba-izquierda">Volver a listado</button></a>
            <form id="Formulario" method="post">
                <div>
                    Name:
                    <input
                        type="text"
                        placeholder="name"
                        name="name"
                        required
                    >
                    </input>
                    <strong>Importante</strong> no dejar un espacio al final!<br />
                </div>
                <div>
                    Tipo:

                    <select
                        name="tipos"
                        id="tipos"
                        required
                    >
                        <option value="">Seleccione tipo</option>
                        <option value="Accion">Accion</option>
                        <option value="Aventura">Aventura</option>
                        <option value="Drama">Drama</option>
                        <option value="Comedia">Comedia</option>
                        <option value="Terror">Terror</option>
                        <option value="Anime">Anime</option>
                        <option value="Suspense">Suspense</option>
                        <option value="Romance">Romance</option>
                    </select>
                </div>
                <div>
                    PLataforma:

                    <select
                        name="plataformas"
                        id="plataformas"
                        required
                    >
                        <option value="">Seleccione plataforma</option>
                        <option value="Netflix">Netflix</option>
                        <option value="PrimeVideo">PrimeVideo</option>
                        <option value="HBO">HBO</option>
                        <option value="Disney">Disney</option>
                        <option value="Chrunchyroll">Chrunchyroll</option>
                    </select>
                </div>
                <div>
                    Valoracion:
                    <input
                        type="number"
                        placeholder="Valoracion"
                        name="valoracion"
                        required
                    >
                    </input>
                </div>
                <div>
                    Duracion "en minutos":
                    <input
                        type="number"
                        placeholder="Duracion"
                        name="duracion"
                        required
                    >
                    </input>
                </div>
                <div>
                    Imagen:
                    <input
                        type="text"
                        placeholder="Imagen"
                        name="imagen"
                    >
                    </input>
                </div>
                <div>
                    Comentarios:
                    <input
                        type="text"
                        placeholder="Comentarios"
                        name="comentarios"
                    >
                    </input>
                </div>
                <div id="error-message">{props.data && props.data.message}</div>

                <button type="submit" >
                    Añadir
                </button>
            </form>
        </div>
    )
}

export default Page;
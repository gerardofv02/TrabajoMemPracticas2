import { FreshContext, Handlers } from "$fresh/server.ts";
import jwt from "jsonwebtoken";

import { setCookie } from "$std/http/cookie.ts"
import Login from "../components/Login.tsx"
export const handler: Handlers = {
    POST: async (req: Request, ctx: FreshContext) => {
        const form = await req.formData()
        const username = form.get("username")
        const password = form.get("password")
        if (!username || !password) {
            return new Response("",
                { status: 400 }
            )
        }
        const data = {
            username: username,
            password: password
        }

        const res = await fetch("http://back:3000/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        })

        if (res.status !== 200) {
            const body = await res.json()
            console.log(body)
            return ctx.render({ message: body!.message })
        }

        const token = jwt.sign(
            {
                username: username,
            },
            "mysupersecret",
            { expiresIn: "24h", }

        )

        const headers = new Headers();
        const url = new URL(req.url)

        setCookie(headers, {
            name: "auth",
            value: token,
            sameSite: "Lax",
            domain: url.hostname,
            path: "/",
            secure: true
        });
        headers.set("location", "/")

        return new Response(null, {
            status: 303,
            headers
        })

    }
}


const Page = () => {
    return (
        <Login></Login>
    )
}

export default Page;
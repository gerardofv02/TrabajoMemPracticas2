import { FreshContext, Handler, Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

type Data = {
  message: string;
};
export const handler: Handlers = {
  POST: async (req: Request, ctx: FreshContext<unknown, Data>) => {
    const url = new URL(req.url);
    const form = await req.formData();
    const username = form.get("username");
    const password = form.get("password");
    console.log("Username: ", username, "Password: ", password)
    if (!username || !password) {
      return ctx.render({ message: "Need values front" });
    }
    console.log("Ahora vamos por aquio")
    const data = {
      username: username,
      password: password,
    };

    const res = await fetch("http://back:3000/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "Application/json"
      }
    });

    if (res.status !== 200) {
      const body = await res.json();
      return ctx.render({ message: body!.message });
    }
    const body = await res.json();
    console.log("Mibody", body);
    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: body.message,
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
  },
};

const Page = (props: PageProps<{ message: string }>) => {
  return (
    <>
      {props.data && props.data.message}
      <form class="container-login" method="post">
        <h1>Login</h1>
        <label for="username">Username</label>
        <input type="text" name="username" placeholder="username" required />
        <label for="password">Password</label>
        <input type="password" name="password" placeholder="password" required />
        <button type="submit">Login</button>
      </form>
    </>
  );
};
export default Page;

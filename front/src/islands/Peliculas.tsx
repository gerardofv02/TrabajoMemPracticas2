import { useEffect, useState } from "preact/hooks";
import { pelicula } from "../types.ts";

const Peliculas = () => {
  const [data, setData] = useState<pelicula[]>([]);
  const [error, setError] = useState<{ message: string }>();

  const getData = async () => {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find((c) => c.startsWith("auth"));
    const miAuth = authCookie!.split("=")[1];
    //console.log("EStoy")
    const res = await fetch(`http://localhost:3000/getPelisUser/${miAuth}`, {
      method: "GET",
    });
    //console.log("STATUS: ", res.status)
    const body = await res.json();
    if (res.status !== 200) {
      setError({ message: body.message });
      setData([]);
      return;
    }
    setError({ message: "" });
    //console.log(body)
    setData(body);
  };
  const eliminar = async (id: string) => {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find((c) => c.startsWith("auth"));
    const miAuth = authCookie!.split("=")[1];
    const prueba = await fetch(`http://localhost:3000/deletePeli/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ auth: miAuth }),
      headers: {
        "Content-Type": "Application/json",
      },
    });
    //console.log(prueba)
    const body = await prueba.json();
    if (prueba.ok) {
      document.cookie = `auth=${body.auth}; path=/`;
    } else {
      setError({ message: body.message });
    }
    getData();
  };
  useEffect(() => {
    try {
      getData();
      //console.log(data);
    } catch (e) {
      throw new Response("XD", { status: 500 });
    }
  }, []);

  return (
    <div>
      <div class="bloque-arriba">
        <a href="/tipos/Terror">
          <button>Terror</button>
        </a>
        <a href="/tipos/Aventura">
          <button>Aventura</button>
        </a>
        <a href="/tipos/Comedia">
          <button>Comedia</button>
        </a>
        <a href="/tipos/Accion">
          <button>Accion</button>
        </a>
        <a href="/tipos/Drama">
          <button>Drama</button>
        </a>
        <a href="/tipos/Anime">
          <button>Anime</button>
        </a>
        <a href="/tipos/Suspense">
          <button>Suspense</button>
        </a>
        <a href="/tipos/Romance">
          <button>Romance</button>
        </a>
      </div>
      <a href="/addPeli">
        <button class="arriba-izquierda">Añadir película</button>
      </a>
      {error && error.message && (
        <div class="message-error">{error.message}</div>
      )}
      {data && data.length == 0 && (
        <div>
          No tienes peliculas añadidas,{" "}
          <a href="/addPeli">¡Añade la primera!</a>
        </div>
      )}
      <div class="container">
        {data && data.map((peli) => {
          //console.log(peli.image);
          return (
            <div class="peli-sola">
              <a href={`/peli/${peli.name}`} key={peli._id}>
                <h1>{peli.name}</h1>
                <img src={`${peli.image}`} />
              </a>
              <button
                onClick={() => {
                  eliminar(peli._id);
                }}
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Peliculas;

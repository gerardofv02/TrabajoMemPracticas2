import { useEffect, useState } from "preact/hooks";
import { FunctionComponent } from "preact";

type csrProps = {
  tipo: string;
};
type PeliculaSimple = {
  name: string;
  tipo: string;
  image: string;
  valoracion: number;
  duracion: number;
  comentarios: string[];
  _id: string;
};

type PeliculasCompletas = {
  peliDB: PeliculaSimple[];
};
const Tipos: FunctionComponent<csrProps> = (props) => {
  const tipo = props.tipo;
  //console.log(tipo);
  const [midata, setData] = useState<PeliculaSimple[]>([]);
  const [error, setError] = useState<{ message: string }>();

  const getData = async () => {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find((c) => c.startsWith("auth"));
    const miAuth = authCookie!.split("=")[1];
    const res = await fetch(
      `http://localhost:3000/getPelisTipos/${tipo}/${miAuth}`,
    );
    const body = await res.json();

    if (res.status !== 200) {
      setError(body);
    } else {
      setData(body);
    }
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
    if (prueba.ok) {
      const body = await prueba.json();
      document.cookie = `auth=${body.auth}; path=/`;
    } else {
      setError({ message: "Error al eliminar" });
    }
    getData();
  };

  useEffect(() => {
    try {
      getData();
    } catch (e) {
      setError({ message: e });
    }
  }, []);

  return (
    <div>
      <div class="error-message">{error && error.message}</div>
      <a href="/listado">
        <button class="arriba-izquierda">Volver a listado</button>
      </a>
      {midata.length == 0 && (
        <div>
          No hay películas de este tipo, ¿desea{" "}
          <strong>
            <a href="/addPeli">añadir alguna</a> o{" "}
            <a href="/listado">volver a listado?</a>
          </strong>
        </div>
      )}
      <div class="container">
        {midata.map((p) => {
          return (
            <div class="peli-sola">
              <a href={`/peli/${p.name}`} key={p._id}>
                <div>{p.name}</div>
                <img src={p.image} alt={`${p.name} image`}></img>
              </a>
              <button onClick={() => eliminar(p._id)}>Eliminar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tipos;

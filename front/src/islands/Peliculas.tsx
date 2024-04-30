import { useEffect, useState } from "preact/hooks";
import { pelicula } from "../types.ts";


const Peliculas = () => {
  const [data, setData] = useState<pelicula[]>([]);
  const [name, setName] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [valoracion, setValo] = useState<number>(0);
  const [duracion, setDuracion] = useState<number>(0);
  const [image, setImage] = useState<string>("");
  const [comentarios, setComentarios] = useState<string>("");
  const [plataforma, setPlataforma] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const getData = async () => {
    const res = await fetch("http://localhost:3000/getPelis");
    if (res.status !== 200) {
      throw new Response("Error fetching data", { status: 400 });
    }
    const pelis: pelicula[] = await res.json();
    console.log(pelis)
    setData(pelis);
  };
  const eliminar = async (id: string) => {
    const prueba = await fetch(`http://localhost:3000/deletePeli/${id}`, {
      method: "DELETE",
    });

    if (prueba.ok) {
      setError(false);
    } else {
      setError(true);
    }
    getData();
  };
  async function postPeli() {
    const introducir: Partial<pelicula> = {
      name: name,
      tipo: tipo,
      valoracion: valoracion,
      duracion: duracion,
      image: image,
      comentarios: comentarios,
      plataforma: plataforma,
    };
    try {
      await fetch(`http://localhost:3000/addPeli`, {
        method: "POST",
        body: JSON.stringify(introducir),
      });
    } catch (e) {
      throw new Response(e, { status: 500 });
    }

    setName("");
    setTipo("");
    setValo(0);
    setComentarios("");
    setDuracion(0);
    setImage("");
    getData();
  }
  useEffect(() => {
    try {
      getData();
      console.log(data);
    } catch (e) {
      throw new Response("XD", { status: 500 });
    }
  }, []);

  return (
    <div>
      <div class="container">
        {data && data.map((peli) => {
          console.log(peli.image);
          return (
            <a class="pelisola" href={`/peli/${peli._id}`} key={peli._id}>
              <h1>{peli.name}</h1>
              <img src={`${peli.image}`} />
              <button onClick={() => { eliminar(peli._id) }}>Eliminar</button>
            </a>
          );
        })}
      </div>
      <div id="Formulario">
        <div>
          Name:
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.currentTarget.value)}
          >
          </input>
          Importante no dejar un espacio al final!<br />
        </div>
        <div>
          Tipo:

          <select
            name="Tipos"
            id="types"
            onChange={(e) => setTipo(e.currentTarget.value)}
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
            name="Tipos"
            id="types"
            onChange={(e) => setPlataforma(e.currentTarget.value)}
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
            onBlur={(e) => setValo(parseInt(e.currentTarget.value))}
          >
          </input>
        </div>
        <div>
          Duracion "en minutos":
          <input
            type="number"
            placeholder="Duracion"
            onBlur={(e) => setDuracion(parseInt(e.currentTarget.value))}
          >
          </input>
        </div>
        <div>
          Imagen:
          <input
            type="text"
            placeholder="Imagen"
            onChange={(e) => setImage(e.currentTarget.value)}
          >
          </input>
        </div>
        <div>
          Comentarios:
          <input
            type="text"
            placeholder="Comentarios"
            onChange={(e) => setComentarios(e.currentTarget.value)}
          >
          </input>
        </div>

        <button
          onClick={async (e) => {
            try {
              await postPeli();
              console.log("LLego aki");
              console.log("Name: ", name);
              console.log("Valo: ", valoracion);
              console.log("Dura: ", duracion);
              console.log("Tipo: ", tipo);
              console.log("Imagen: ", image);
              setError(false);
            } catch (e) {
              setError(true);
            }
          }}
        >
          Añadir
        </button>
      </div>
    </div>
  );
};

export default Peliculas;

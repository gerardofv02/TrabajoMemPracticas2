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
};

type PeliculasCompletas = {
    peliDB: PeliculaSimple[];
};
const Tipos: FunctionComponent<csrProps> = (props) => {
    const tipo = props.tipo;
    console.log(tipo);
    const [midata, setData] = useState<PeliculaSimple[]>([]);

    const getData = async () => {
        const res = await fetch(`http://localhost:3000/getPelisTipos/${tipo}`);

        if (res.status !== 200) {
            throw new Response("Error fetching", { status: 500 });
        }
        const data: PeliculaSimple[] = await res.json();
        console.log(data);
        setData(data);
    };

    useEffect(() => {
        try {
            getData();
        } catch (e) {
            throw new Response(e, { status: 500 });
        }
    }, []);

    return (
        <div class="container">
            {midata.map((p) => {
                return (
                    <div class="peliculasimple">
                        <div>{p.name}</div>
                    </div>
                )
            })}
        </div>
    );
};

export default Tipos;


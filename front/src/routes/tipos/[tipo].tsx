import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Tipos from "../../islands/Tipos.tsx"




const Page = (props: PageProps) => {
    const { tipo } = props.params
    return (
        <Tipos key={tipo} tipo={tipo} />
    )
}

export default Page;
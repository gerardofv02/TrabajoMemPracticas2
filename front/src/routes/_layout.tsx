import { PageProps } from "$fresh/server.ts";
import Logout from "../islands/Logout.tsx"



export default function Layout({ Component, state }: PageProps) {
    // do something with state here
    return (
        <>
            <Logout></Logout>
            <Component />
        </>
    );
}

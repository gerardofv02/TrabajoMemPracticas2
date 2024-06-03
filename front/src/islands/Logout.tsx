const Logout = () => {
    const onLogOut = () => {
        // remove cookie
        document.cookie = "auth=;  path=/;";
        // redirect to login
        window.location.href = "/login";
    };

    return <button onClick={() => onLogOut()} className="arriba-derecha">Logout</button>;
};

export default Logout;
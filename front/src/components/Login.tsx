const Login = () => {

    return (
        <>
            <form class="container-login" method="post">
                <h1>Login</h1>
                <label for="username">Username</label>
                <input type="text" name="username" placeholder="username" />
                <label for="password" >Password</label>
                <input type="password" name="password" placeholder="password" />
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default Login;
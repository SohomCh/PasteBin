import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            const token=response.data.data.token;
            localStorage.setItem(
                "token",
                token
            );

            // this function directly takes to create page after login
            navigate("/create")
            console.log("Token storedd")
            console.log(token);

        }
        catch (error) {

            console.log(
                error.response?.data
            );

        }
    };

    return (
        <div>

            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Email</label>

                    <br />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                </div>

                <br />

                <div>

                    <label>Password</label>

                    <br />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;
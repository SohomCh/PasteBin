import { useState } from "react";
import api from '../services/api';

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

     const handleSubmit = async (e) => {

        e.preventDefault();

        try{

            const response=await api.post(
                '/auth/register',

                {

                    name,
                    email,
                    password
                }
            );
            console.log(response.data);
        }
        catch(error){

            console.log(error.response?.data)
        }

    };

    return (
        <div>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Name</label>

                    <br />

                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                </div>

                <br />

                <div>

                    <label>Email</label>

                    <br />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </div>

                <br />

                <button type="submit">
                    Register
                </button>

            </form>

        </div>
    );
}

export default Register;
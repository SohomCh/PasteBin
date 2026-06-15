import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    const handleLogout = () => {

       const token= localStorage.removeItem("token");

        navigate("/login");
    };

    return (
        
    <nav>

        {!token && (
            <>
                <Link to="/login">Login</Link>

                {" | "}

                <Link to="/register">Register</Link>
            </>
        )}

        {token && (
            <>
                <Link to="/create">Create</Link>

                {" | "}

                <Link to="/my-pastes">My Pastes</Link>

                {" | "}

                <button onClick={handleLogout}>
                    Logout
                </button>
            </>
        )}

    </nav>
);
    
}

export default Navbar;
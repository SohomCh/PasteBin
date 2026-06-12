import{Link} from"react-router-dom";

function Navbar(){
    return(
        <nav>
            <Link to="/">Login</Link>
            {"|"}
            <Link to='/register'>Register</Link>
            {"|"}

            <Link to="/create">Create</Link>

            {"|"}
            <Link to="/my-pastes">My Pastes</Link>
        </nav>

    )
    
}

export default Navbar
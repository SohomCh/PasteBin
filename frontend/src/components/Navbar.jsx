import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
       const token= localStorage.removeItem("token");
        navigate("/login");
    };

    const linkClass = (to) => `px-3 py-2 rounded-xl text-sm font-medium transition duration-200 ${location.pathname === to ? 'bg-white/10 text-white' : 'text-[var(--muted)] hover:text-white hover:bg-white/5'}`;

    return (
        <header className="sticky top-0 z-40 backdrop-blur-sm bg-[#18181B]/95 border-b border-white/10">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <Link to="/" className="inline-flex items-center gap-3 no-underline">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#27272A] text-[var(--text)]">
                        <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M6 7h12M6 12h12M6 17h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-base font-semibold tracking-wide text-white">PasteBin</span>
                </Link>

                <div className="flex items-center gap-6">
                    {!token && (
                        <>
                            <Link to="/login" className={linkClass('/login')}>Login</Link>
                            <Link to="/register" className={linkClass('/register')}>Register</Link>
                        </>
                    )}

                    {token && (
                        <>
                            <Link to="/create" className={linkClass('/create')}>Create</Link>
                            <Link to="/my-pastes" className={linkClass('/my-pastes')}>My Pastes</Link>
                            <button onClick={handleLogout} className="inline-flex items-center rounded-lg border border-white/10 bg-[#111111] px-4 py-2 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:border-red-500">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
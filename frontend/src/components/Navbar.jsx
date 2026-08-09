import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
       const token= localStorage.removeItem("token");
        navigate("/login");
    };

    const linkClass = (to) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
            location.pathname === to
                ? 'bg-[var(--surface-3)] text-[var(--text)]'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
        }`;

    return (
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-xl">
            <div className="container flex h-14 items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-2.5 no-underline group">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] shadow-[0_4px_14px_rgba(91,108,255,0.35)]">
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                            <path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                            <path d="M10 13h5M10 16.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </span>
                    <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">PasteVault</span>
                </Link>

                <nav className="flex items-center gap-1">
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
                            <button onClick={handleLogout} className="btn btn-ghost ml-1 px-3 py-2">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M15 12H4M4 12l3.5-3.5M4 12l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11 4h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;

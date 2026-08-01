import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

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

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-[400px] fade-up">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] shadow-[0_8px_24px_rgba(91,108,255,0.35)]">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                            <path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                            <path d="M10 13h5M10 16.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance">Welcome back</h1>
                    <p className="mt-2 text-sm muted text-pretty">Sign in to manage, collaborate on, and securely share your snippets.</p>
                </div>

                <div className="card sheen p-7">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text)]">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--text)]">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                            {loading ? (
                                <svg className="spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"></path>
                                </svg>
                            ) : null}
                            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                        </button>
                    </form>

                    <div className="mt-6 border-t border-[var(--border)] pt-5 text-center text-sm muted">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]">Create one</Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs faint text-pretty">
                    By continuing you agree to our <a className="underline hover:text-[var(--muted)]">Terms</a> and <a className="underline hover:text-[var(--muted)]">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}

export default Login;

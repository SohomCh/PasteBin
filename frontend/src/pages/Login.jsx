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
        <div className="min-h-screen flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-[420px] mx-auto">
                <div className="card p-8">
                    <div className="mb-6 flex items-center justify-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--primary)] shadow">
                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
                                <path d="M8 12h8M8 16h6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-semibold text-white text-center">Welcome back</h1>
                    <p className="mt-2 text-sm muted text-center max-w-[360px] mx-auto">Sign in to manage your pastes, collaborate, and securely share snippets.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium muted mb-2">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[var(--surface)] placeholder-placeholder text-white border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition smooth"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium muted mb-2">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[var(--surface)] placeholder-placeholder text-white border border-[var(--border)] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition smooth"
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-sm muted">Don't have an account? <Link to="/register" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium">Register</Link></div>
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-3 btn-primary py-3 shadow">
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                ) : null}
                                <span className="text-sm">{loading ? 'Signing in...' : 'Login'}</span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="mt-6 text-xs text-center muted">By continuing you agree to our <a className="text-white/80 underline">Terms</a> and <a className="text-white/80 underline">Privacy Policy</a>.</div>
            </div>
        </div>
    );
}

export default Login;
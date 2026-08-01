import { useState } from "react";
import api from '../services/api';
import { Link } from 'react-router-dom';

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

     const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

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
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-[400px] fade-up">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-3)] border border-[var(--border-strong)]">
                        <svg className="h-6 w-6 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-balance">Create your account</h1>
                    <p className="mt-2 text-sm muted text-pretty">Sign up to start creating and sharing pastes.</p>
                </div>

                <div className="card sheen p-7">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--text)]">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="input"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text)]">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
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
                                placeholder="Choose a password"
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
                            <span>{loading ? 'Creating...' : 'Create account'}</span>
                        </button>
                    </form>

                    <div className="mt-6 border-t border-[var(--border)] pt-5 text-center text-sm muted">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;

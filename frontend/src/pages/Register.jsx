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
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md mx-auto">
                <div className="card p-8">
                    <h1 className="text-3xl font-semibold text-white text-center">Create account</h1>
                    <p className="text-sm muted text-center mt-2">Sign up to start creating pastes</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium muted mb-2">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-[var(--surface)] text-white border border-[var(--border)] rounded-xl p-3 text-sm placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition smooth"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium muted mb-2">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[var(--surface)] text-white border border-[var(--border)] rounded-xl p-3 text-sm placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition smooth"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium muted mb-2">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Choose a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[var(--surface)] text-white border border-[var(--border)] rounded-xl p-3 text-sm placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition smooth"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm muted">Already have an account? <Link to="/login" className="text-[var(--primary)] hover:text-[var(--primary-hover)]">Login</Link></div>
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 btn-primary py-3">
                                {loading ? 'Creating...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
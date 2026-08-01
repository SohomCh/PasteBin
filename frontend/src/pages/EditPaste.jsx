import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditPaste() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    async function fetchPaste() {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                `/paste/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setContent(response.data.data.content);
        }
        catch (error) {
            alert("Failed to fetch paste");
        }
        finally {
            setLoading(false);
        }
    }

    async function handleUpdate() {
    try {

        const token = localStorage.getItem("token");

        await api.patch(
            `/paste/${id}`,
            {
                content: content
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert("Paste updated successfully!");

        navigate("/my-pastes");

    } catch (error) {

        alert("Failed to update paste");

    }
}

    useEffect(() => {
        fetchPaste();
    }, []);

    if (loading) {
        return (
            <div className="py-10">
                <main className="mx-auto max-w-3xl">
                    <div className="card flex items-center gap-3 p-6 muted">
                        <svg className="spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"></path>
                        </svg>
                        Loading...
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="py-10">
            <main className="mx-auto max-w-3xl fade-up">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Edit paste</h1>
                    <p className="mt-1 text-sm muted">Modify your paste content below.</p>
                </header>

                <section className="card sheen p-6 sm:p-7">
                    <label className="mb-2 block text-sm font-medium text-[var(--text)]">Content</label>
                    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--bg-subtle)]">
                        <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#e3b341]/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]/70" />
                            <span className="ml-2 text-xs faint font-mono">snippet.txt</span>
                        </div>
                        <textarea
                            rows="12"
                            className="w-full min-h-[220px] resize-vertical bg-transparent px-4 py-3 text-sm font-mono leading-relaxed text-[var(--text)] placeholder-[var(--placeholder)] focus:outline-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-3 border-t border-[var(--border)] pt-5">
                        <button onClick={()=>navigate(-1)} className="btn btn-secondary px-4 py-2.5">Cancel</button>
                        <button onClick={handleUpdate} className="btn btn-primary px-5 py-2.5">Save changes</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default EditPaste;

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
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            alert("Failed to fetch paste");
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

        navigate("/mypastes");

    } catch (error) {

        console.log(error);
        alert("Failed to update paste");

    }
}

    useEffect(() => {
        fetchPaste();
    }, []);

    if (loading) {
        return <div className="min-h-screen text-white py-10 px-4"><main className="max-w-3xl mx-auto"> <div className="muted">Loading...</div></main></div>;
    }

    return (
        <div className="min-h-screen text-white py-10 px-4">
            <main className="max-w-3xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold">Edit Paste</h1>
                    <p className="text-sm muted mt-1">Modify your paste content below.</p>
                </header>

                <section className="card p-6">
                    <label className="block text-sm muted mb-2">Content</label>
                    <textarea
                        rows="10"
                        className="w-full min-h-[160px] resize-vertical bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl p-4 text-sm font-mono placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition smooth"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="mt-4 flex items-center justify-end gap-3">
                        <button onClick={()=>navigate(-1)} className="px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text)]">Cancel</button>
                        <button onClick={handleUpdate} className="px-4 py-2 btn-primary text-sm font-medium">Save Changes</button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default EditPaste;
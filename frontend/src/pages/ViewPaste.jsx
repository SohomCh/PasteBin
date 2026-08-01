import{useState} from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from"../services/api"
import { useParams } from "react-router-dom";

function ViewPaste() {

    const { id } = useParams();

    const [paste, setPaste] = useState(null);
    useEffect(()=>{
        fetchPaste();
    }
,[])

async function fetchPaste(){
    try{
        const token=localStorage.getItem("token")
      const response= await api.get(
            `/paste/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        console.log(response.data)
        setPaste( response.data.data)
        


        
    }
    catch(error){

        console.log(error);
        alert("Failed to fetch");

    }
}

    const meta = paste ? [
        { label: "Created", value: paste.createdAt ? new Date(paste.createdAt).toLocaleString() : "—" },
        { label: "Expiry", value: paste.expiresAt ? new Date(paste.expiresAt).toLocaleDateString() : "Never" },
        { label: "Views", value: paste.views ?? 0 },
        { label: "Visibility", value: paste.isPublic ? "Public" : "Private" },
    ] : [];

    return (
    <div className="py-10">
        <main className="mx-auto max-w-3xl fade-up">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">View paste</h1>
                <p className="mt-1 text-sm muted">Detailed view of your paste.</p>
            </header>

            {!paste ? (
                <div className="card flex items-center gap-3 p-6 muted">
                    <svg className="spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"></path>
                    </svg>
                    Loading...
                </div>
            ) : (

                <div className="space-y-5">
                    <section className="card sheen p-6">
                        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                            <div className="min-w-0">
                                <div className="text-xs uppercase tracking-wide faint">Paste ID</div>
                                <div className="truncate font-mono text-lg font-medium text-[var(--text)]">{paste.pasteId}</div>
                            </div>
                            <span className={`badge ${paste.isPublic ? 'badge-success' : 'badge-muted'}`}>
                                {paste.isPublic ? 'Public' : 'Private'}
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {meta.map((m) => (
                                <div key={m.label}>
                                    <div className="text-xs uppercase tracking-wide faint">{m.label}</div>
                                    <div className="mt-1 text-sm font-medium text-[var(--text)]">{m.value}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card p-6">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm font-medium text-[var(--text)]">Content</div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button onClick={() => { navigator.clipboard?.writeText(paste.content) }} className="btn btn-secondary px-3 py-2">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
                                        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    </svg>
                                    Copy
                                </button>
                                <button onClick={()=>navigate(`/edit/${paste.pasteId}`)} className="btn btn-secondary px-3 py-2">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                                        <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    </svg>
                                    Edit
                                </button>
                                <button onClick={()=>{ if(confirm('Delete this paste?')){ /* UI-only placeholder */ alert('Delete requested (UI only)'); } }} className="btn btn-danger px-3 py-2">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Delete
                                </button>
                                <button className="btn btn-secondary px-3 py-2">
                                    <svg className="h-4 w-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M12 3l1.8 4.9L18.7 9.7l-4.9 1.8L12 16.4l-1.8-4.9L5.3 9.7l4.9-1.8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    </svg>
                                    AI Explain
                                </button>
                            </div>
                        </div>

                        <pre className="code max-h-[60vh] overflow-auto p-5">{paste.content}</pre>
                    </section>
                </div>
            )}

        </main>
    </div>
);
}

export default ViewPaste

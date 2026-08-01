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



    return (
    <div className="min-h-screen text-white py-10 px-4">
        <main className="max-w-3xl mx-auto">
            <header className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold">View Paste</h1>
                <p className="text-sm muted mt-1">Detailed view of your paste</p>
            </header>

            {!paste ? (
                <div className="muted">Loading...</div>
            ) : (

                <div className="space-y-6">
                    <section className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-sm muted">Paste ID</div>
                            <div className="text-lg font-medium text-white truncate">{paste.pasteId}</div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm muted w-full sm:w-auto">
                            <div>
                                <div className="text-xs">Created</div>
                                <div className="text-white font-medium">{paste.createdAt ? new Date(paste.createdAt).toLocaleString() : ''}</div>
                            </div>

                            <div>
                                <div className="text-xs">Expiry</div>
                                <div className="text-white font-medium">{paste.expiresAt ? new Date(paste.expiresAt).toLocaleDateString() : 'Never'}</div>
                            </div>

                            <div>
                                <div className="text-xs">Views</div>
                                <div className="text-white font-medium">{paste.views}</div>
                            </div>

                            <div>
                                <div className="text-xs">Visibility</div>
                                <div className="text-white font-medium">{paste.isPublic ? 'Public' : 'Private'}</div>
                            </div>
                        </div>
                    </section>

                    <section className="card p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm muted">Content</div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { navigator.clipboard?.writeText(paste.content) }} className="px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text)]">Copy</button>
                                <button onClick={()=>navigate(`/edit/${paste.pasteId}`)} className="px-3 py-1 btn-primary text-sm">Edit</button>
                                <button onClick={()=>{ if(confirm('Delete this paste?')){ /* UI-only placeholder */ alert('Delete requested (UI only)'); } }} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-md text-sm text-white">Delete</button>
                                <button className="px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text)]">AI Explain</button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <pre className="bg-[#0b0b0b] text-sm font-mono text-[var(--text)] p-6 rounded-md overflow-auto max-h-[60vh]">{paste.content}</pre>
                        </div>
                    </section>
                </div>
            )}

        </main>
    </div>
);
}

export default ViewPaste
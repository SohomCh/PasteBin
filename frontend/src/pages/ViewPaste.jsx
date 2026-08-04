import{useState} from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from"../services/api"
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"
import toast from "react-hot-toast";

function ViewPaste() {

    const { id } = useParams();
    const navigate = useNavigate();

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

        setPaste( response.data.data)
    }
    catch(error){
        toast.error("Something went wrong");

    }
}

async function handleDelete(){
    const confirmDelete = window.confirm("Are you sure you want to delete this paste?");
    if(!confirmDelete) return;

    try{
        const token=localStorage.getItem("token")
        await api.delete(
            `/paste/${paste.pasteId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );
        toast.success("Paste deleted successfully.");
        navigate("/my-pastes");

    }
    catch(error){
        toast.error("Failed to delete paste.");
    }
}

    const meta = paste ? [
        { label: "Created", value: paste.createdAt ? new Date(paste.createdAt).toLocaleString() : "—" },
        { label: "Expiry", value: paste.expiresAt ? new Date(paste.expiresAt).toLocaleDateString() : "Never" },
        { label: "Views", value: paste.views ?? 0 },
        { label: "Visibility", value: paste.isPublic ? "Public" : "Private" },
    ] : [];



const[aiResponse,setAiResponse]=useState("");
const[loadingAI,setLoadingAI]=useState(false);
const[selectedAction,setSelectedAction]=useState("explain");


async function handleAI(){
    try{
        setLoadingAI(true);
        setAiResponse("");
        const token=localStorage.getItem("token");

        const response=await api.post(
            "/ai/chat",
            {
                content:paste.content,
                action:selectedAction


            },
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        setAiResponse(response.data.data);
        console.log(response.data);
        console.log(typeof response.data);
        toast.success("AI response generated successfully.");
    }
    catch(error){
        console.log(error);
        toast.error("Failed to generate AI response.");

    }finally{

        setLoadingAI(false);
    }


}





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

    {/* Header */}
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

        <h2 className="text-lg font-semibold text-[var(--text)]">
            Paste Content
        </h2>

        <div className="flex flex-wrap items-center gap-2">

            <button
                onClick={() => navigator.clipboard.writeText(paste.content)}
                className="btn btn-secondary"
                
            >
                
                📋 Copy
            </button>

            <button
                onClick={() => navigate(`/edit/${paste.pasteId}`)}
                className="btn btn-secondary"
            >
                ✏️ Edit
            </button>

            <button
                onClick={handleDelete}
                className="btn btn-danger"
            >
                🗑 Delete
            </button>

        </div>

    </div>

    {/* Paste */}
    <pre className="code max-h-[60vh] overflow-auto rounded-xl p-5">
        {paste.content}
    </pre>

    {/* AI Panel */}

    <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

            <div>

                <h2 className="text-xl font-semibold">
                    🤖 AI Assistant
                </h2>

                <p className="mt-1 text-sm muted">
                    Analyze your code or text using Groq AI
                </p>

            </div>

            <button
                disabled={!aiResponse}
                onClick={() => navigator.clipboard.writeText(aiResponse)}
                className="btn btn-secondary"
            >
                📋 Copy Response
            </button>

        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">

            <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2"
            >
                <option value="explain">🧠 Explain</option>
                <option value="summarize">📝 Summarize</option>
                <option value="improve">✨ Improve</option>
                <option value="debug">🐞 Debug</option>
                <option value="optimize">⚡ Optimize</option>
            </select>

            <button
                onClick={handleAI}
                disabled={loadingAI}
                className="btn btn-primary"
            >
                {loadingAI ? (
                    <>
                        <svg
                            className="mr-2 inline h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                opacity=".25"
                            />

                            <path
                                fill="currentColor"
                                d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z"
                            />
                        </svg>

                        Thinking...
                    </>
                ) : (
                    <>✨ Generate Response</>
                   
                )}
            </button>

        </div>

        {aiResponse && (

            <div className="overflow-hidden rounded-2xl border border-[var(--border)]">

                <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-hover)] px-6 py-4">

                    <div>

                        <h3 className="font-semibold">
                            🤖 AI Response
                        </h3>

                        <p className="text-xs muted">
                            Generated using Groq AI
                        </p>

                    </div>

                </div>

                <div className="max-h-[500px] overflow-y-auto p-6">

                    <div className="prose prose-invert max-w-none">

                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {aiResponse}
                        </ReactMarkdown>

                    </div>

                </div>

            </div>

        )}

    </div>

</section>
                </div>
            )}

        </main>
    </div>
);
}

export default ViewPaste


import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'

function CreatePaste() {

    const[content,setContent]=useState("");
    const[isPublic,setIsPublic]=useState(true);
    const[expiry,setExpiry]=useState("");
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
        const token=localStorage.getItem('token');
        console.log(token)
        console.log(expiry)
        console.log(typeof expiry)
        const response=await api.post(
            "/paste",
            {
                content,
                isPublic,
                expiry,
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                },
            }
        );
        toast.success("Paste created successfully")

        console.log(response.data);
        navigate('/my-pastes');
    
}
catch (error) {
    console.log("Entire Error:", error);
    console.log("Response:", error.response);
    console.log("Request:", error.request);
    console.log("Message:", error.message);

    if (error.response) {
        console.log("Response Data:", error.response.data);
    }

    toast.error("Something went wrong");
}

  
};

    return (
        <div className="py-10">
            <main className="mx-auto max-w-3xl fade-up">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Create paste</h1>
                    <p className="mt-1 text-sm muted">Quickly create and share code or text snippets.</p>
                </header>

                <form onSubmit={handleSubmit} className="card sheen p-6 sm:p-7">
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-medium text-[var(--text)]">Content</label>
                                <span className="text-xs faint font-mono">{content.length} chars</span>
                            </div>
                            <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--bg-subtle)]">
                                <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#f85149]/70" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#e3b341]/70" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#3fb950]/70" />
                                    <span className="ml-2 text-xs faint font-mono">snippet.txt</span>
                                </div>
                                <textarea
                                    rows="14"
                                    className="w-full min-h-[240px] resize-vertical bg-transparent px-4 py-3 text-sm font-mono leading-relaxed text-[var(--text)] placeholder-[var(--placeholder)] focus:outline-none"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Paste your text or code here..."
                                />
                            </div>
                            <p className="mt-2 text-xs faint">Tip: monospace formatting is preserved for code snippets.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text)]">Expiry</label>
                                <input
                                    type='date'
                                    value={expiry}
                                    onChange={(e)=>setExpiry(e.target.value)}
                                    className="input [color-scheme:dark]"
                                />
                                <p className="mt-2 text-xs faint">Leave empty for a paste that never expires.</p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text)]">Visibility</label>
                                <div className="inline-flex w-full rounded-[var(--radius)] border border-[var(--border-strong)] bg-[var(--surface-3)] p-1">
                                    <button
                                        type="button"
                                        onClick={()=>setIsPublic(true)}
                                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${isPublic ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}>
                                        Public
                                    </button>
                                    <button
                                        type="button"
                                        onClick={()=>setIsPublic(false)}
                                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${!isPublic ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}>
                                        Private
                                    </button>
                                </div>
                                <p className="mt-2 text-xs faint">Public pastes are visible to others; private ones are link-only.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
                            <div className="flex items-center gap-2 text-sm muted">
                                <svg className="h-4 w-4 text-[var(--success)]" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                                    <path d="M9.5 12l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Stored securely
                            </div>
                            <button type="Submit" className="btn btn-primary px-6 py-2.5">
                                Create paste
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )
};

export default CreatePaste;

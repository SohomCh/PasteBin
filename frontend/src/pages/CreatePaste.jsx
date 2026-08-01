

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        alert("Paste Created Successfully")

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

    alert("Failed to Create Paste");
}

  
};

    return (
        <div className="min-h-screen text-white antialiased font-sans py-10 px-4">
            <main className="max-w-4xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold">Create Paste</h1>
                    <p className="text-sm muted mt-1">Quickly create and share code or text snippets.</p>
                </header>

                <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium muted mb-2">Content</label>
                            <textarea
                                rows="14"
                                className="w-full min-h-[220px] resize-vertical bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl p-4 text-sm font-mono placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition smooth"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your text or code here..."
                            />
                            <div className="flex items-center justify-between mt-2 text-xs muted">
                                <span>{content.length} characters</span>
                                <span className="hidden sm:inline">Tip: Use the monospace font for code snippets.</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-medium muted mb-2">Expiry</label>
                                <input
                                    type='date'
                                    value={expiry}
                                    onChange={(e)=>setExpiry(e.target.value)}
                                    className="w-full bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium muted mb-2">Visibility</label>
                                <div className="inline-flex items-center gap-3 bg-[var(--surface)] p-2 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={()=>setIsPublic(true)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isPublic ? 'btn-primary shadow' : 'bg-[#111111] text-[var(--muted)] hover:bg-[#151516]'}`}>
                                        Public
                                    </button>
                                    <button
                                        type="button"
                                        onClick={()=>setIsPublic(false)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!isPublic ? 'btn-primary shadow' : 'bg-[#111111] text-[var(--muted)] hover:bg-[#151516]'}`}>
                                        Private
                                    </button>
                                </div>
                                <p className="mt-2 text-xs muted">Public pastes are visible to others; private ones are only accessible via link.</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <div className="text-sm muted mr-auto">Your pastes are stored securely.</div>
                            <button type="Submit" className="inline-flex items-center gap-2 btn-primary py-2 px-6 shadow-md">
                                Create Paste
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )
};

export default CreatePaste;
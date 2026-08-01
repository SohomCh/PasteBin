import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyPastes() {
  const [pastes, setPastes] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPastes();
  }, []);

  async function fetchPastes() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        "/paste/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPastes(response.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch");
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this paste?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(
        `/paste/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPastes((prevPastes) => prevPastes.filter((paste) => paste.pasteId !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete paste");
    }
  }

  const filtered = pastes.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (p.pasteId && p.pasteId.toLowerCase().includes(q)) ||
      (p.content && p.content.toLowerCase().includes(q))
    );
  });


  async function toggleVisiblity(id){
    const token = localStorage.getItem("token");

    try {
      await api.patch(
        `/paste/${id}/visibility`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // update local state to reflect visibility change
      setPastes((prev) =>
        prev.map((p) =>
          p.pasteId === id || p._id === id ? { ...p, isPublic: !p.isPublic } : p
        )
      );
    } catch (error) {
      console.log(error);
      alert("Failed to toggle visibility");
    }
  }

  // dynamic layout: fewer pastes -> larger cards; many pastes -> compact cards
  const few = filtered.length <= 3;
  const twoOrLess = filtered.length <= 2;
  const gridCols = twoOrLess ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  const cardBase = "rounded-xl border border-[var(--border)] bg-[var(--surface)] transform hover:-translate-y-1 hover:shadow-lg transition-all";
  const cardPadding = "p-6"; // consistent p-6 per design system
  const titleSize = few ? "text-lg" : "text-sm";
  const actionBtnBase = "inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-all border";

  return (
    <div className="min-h-screen text-white py-10 px-4">
      <main className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">My Pastes</h1>
            <p className="text-sm muted mt-1">Manage your snippets and sharing settings</p>
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="relative flex-1">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by id or content..."
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-2 pl-10 pr-4 text-sm placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                aria-label="Search pastes"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-sm rounded-full px-3 py-1 muted">{pastes.length} pastes</span>
            </div>
          </div>
        </header>

        <section>
          {filtered.length === 0 ? (
            <div className="card p-8 text-center muted">
              <div className="text-2xl mb-2">No pastes found</div>
              <div className="mb-4">Try creating your first paste or adjust your search.</div>
              <div>
                <button onClick={() => navigate("/create")} className="btn-primary px-4 py-2">
                  Create Paste
                </button>
              </div>
            </div>
          ) : (
            <div className={`mt-4 grid ${gridCols} gap-6`}>
              {filtered.map((paste) => (
                <article key={paste._id} className={`${cardBase} ${cardPadding}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className={`${titleSize} font-semibold text-white truncate`}>{paste.pasteId}</h3>
                      <div className="mt-1 text-xs muted">{paste.createdAt ? new Date(paste.createdAt).toLocaleDateString() + ' · ' + new Date(paste.createdAt).toLocaleTimeString() : ''}</div>
                    </div>

                    <div className="transform transition-all hover:scale-105">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${paste.isPublic ? 'bg-emerald-900 text-emerald-300' : 'bg-[#0f0f10] text-[var(--muted)]'}`}>
                        {paste.isPublic ? (
                          <span aria-hidden className="text-emerald-300">🌍</span>
                        ) : (
                          <span aria-hidden className="text-[var(--muted)]">🔒</span>
                        )}
                        <span>{paste.isPublic ? 'Public' : 'Private'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <pre className="bg-[var(--bg)] text-sm font-mono text-[var(--text)] p-3 rounded-md overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>{paste.content && (paste.content.length > 120 ? `${paste.content.slice(0,120)}...` : paste.content)}</pre>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => navigate(`/paste/${paste.pasteId}`)} className={`${actionBtnBase} border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/6`}>
                        <span className="text-lg">👁</span>
                        <span>View</span>
                      </button>

                      <button onClick={() => navigate(`/edit/${paste.pasteId}`)} className={`${actionBtnBase} text-[var(--muted)] hover:bg-white/5`}>
                        <span className="text-lg">✏</span>
                        <span>Edit</span>
                      </button>

                      <button onClick={() => handleDelete(paste.pasteId)} className={`${actionBtnBase} border-red-600 text-red-600 hover:bg-red-600/10`}>
                        <span className="text-lg">🗑</span>
                        <span>Delete</span>
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() => toggleVisiblity(paste.pasteId)}
                        title={paste.isPublic ? 'Make private' : 'Make public'}
                        aria-pressed={paste.isPublic}
                        className={`${actionBtnBase} rounded-full px-3 h-9 min-w-max ${paste.isPublic ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-transparent text-[var(--muted)] border-[var(--border)] hover:bg-white/5'}`}
                      >
                        <span className="text-sm" aria-hidden>{paste.isPublic ? '🌍' : '🔒'}</span>
                        <span className="text-sm">{paste.isPublic ? 'Public' : 'Private'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyPastes;

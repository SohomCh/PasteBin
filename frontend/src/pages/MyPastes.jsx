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
  const twoOrLess = filtered.length <= 2;
  const gridCols = twoOrLess ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="py-10">
      <main className="mx-auto max-w-6xl fade-up">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My pastes</h1>
            <p className="mt-1 text-sm muted">Manage your snippets and sharing settings.</p>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--faint)]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M20 20l-3.8-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by id or content..."
                className="input pl-10"
                aria-label="Search pastes"
              />
            </div>
            <span className="badge badge-muted whitespace-nowrap">{pastes.length} total</span>
          </div>
        </header>

        <section>
          {filtered.length === 0 ? (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-3)] border border-[var(--border-strong)]">
                <svg className="h-6 w-6 text-[var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-lg font-medium">No pastes found</div>
              <p className="mb-6 mt-1 max-w-sm text-sm muted text-pretty">Try creating your first paste or adjust your search query.</p>
              <button onClick={() => navigate("/create")} className="btn btn-primary px-5 py-2.5">
                Create paste
              </button>
            </div>
          ) : (
            <div className={`grid ${gridCols} gap-5`}>
              {filtered.map((paste) => (
                <article key={paste._id} className="card card-hover sheen flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-mono text-sm font-semibold text-[var(--text)]">{paste.pasteId}</h3>
                      <div className="mt-1 text-xs faint">{paste.createdAt ? new Date(paste.createdAt).toLocaleDateString() + ' · ' + new Date(paste.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                    </div>
                    <span className={`badge ${paste.isPublic ? 'badge-success' : 'badge-muted'}`}>
                      {paste.isPublic ? (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14.5 0 17M12 3.5c-2.5 2.5-2.5 14.5 0 17" stroke="currentColor" strokeWidth="1.3" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      )}
                      {paste.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>

                  <pre className="code mt-4 overflow-hidden p-3.5" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>{paste.content && (paste.content.length > 160 ? `${paste.content.slice(0,160)}...` : paste.content)}</pre>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => navigate(`/paste/${paste.pasteId}`)} title="View" className="btn btn-ghost px-2.5 py-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button onClick={() => navigate(`/edit/${paste.pasteId}`)} title="Edit" className="btn btn-ghost px-2.5 py-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                          <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button onClick={() => handleDelete(paste.pasteId)} title="Delete" className="btn btn-ghost px-2.5 py-2 text-[var(--danger)] hover:bg-[var(--danger-soft)]">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleVisiblity(paste.pasteId)}
                      title={paste.isPublic ? 'Make private' : 'Make public'}
                      aria-pressed={paste.isPublic}
                      className={`btn px-3 py-2 ${paste.isPublic ? 'btn-secondary' : 'btn-secondary'}`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M4 12h10M4 12l3-3M4 12l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 6v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      {paste.isPublic ? 'Make private' : 'Make public'}
                    </button>
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

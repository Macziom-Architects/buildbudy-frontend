"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { apiGet } from "@/lib/api/client";
import { adminRenameCategory, reindexSearch } from "@/lib/api/admin";

/** Mirror of the backend's slugifier so the admin sees the resulting slug before saving. */
function previewSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(null);
  const [edits, setEdits] = useState({}); // id -> draft name
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");

  function load() {
    apiGet("/products/categories")
      .then(setCategories)
      .catch((err) => { setCategories([]); setNotice(err?.message || "Failed to load."); });
  }
  useEffect(load, []);

  async function save(cat) {
    const name = (edits[cat.id] ?? "").trim();
    if (!name || name === cat.name) {
      setEdits((e) => ({ ...e, [cat.id]: undefined }));
      return;
    }
    setBusyId(cat.id);
    setNotice("");
    try {
      const updated = await adminRenameCategory(cat.id, name);
      reindexSearch();
      setNotice(`"${cat.name}" → "${updated.name}" (slug: ${updated.slug})`);
      setEdits((e) => ({ ...e, [cat.id]: undefined }));
      load();
    } catch (err) {
      setNotice(err?.message || "Rename failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-extrabold text-primary tracking-tight">Categories</h1>
      <p className="text-xs text-muted mt-0.5 mb-4">
        Renaming updates the slug too — frontend category routes follow the slug, so keep names in sync with the pages you want.
      </p>

      {notice && (
        <div className="flex items-start justify-between gap-3 mb-3 text-xs text-primary bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} className="shrink-0 text-muted hover:text-primary cursor-pointer" aria-label="Dismiss">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-50">
        {categories === null ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-muted text-center py-16">No categories.</p>
        ) : (
          categories.map((cat) => {
            const draft = edits[cat.id];
            const editing = draft !== undefined;
            const dirty = editing && draft.trim() !== "" && draft.trim() !== cat.name;
            return (
              <div key={cat.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={editing ? draft : cat.name}
                    onChange={(e) => setEdits((ed) => ({ ...ed, [cat.id]: e.target.value }))}
                    className="w-full max-w-xs border border-transparent hover:border-gray-200 focus:border-accent rounded-md px-2 py-1.5 text-sm font-semibold text-primary focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-muted mt-0.5 px-2 font-mono">
                    /{dirty ? previewSlug(draft) : cat.slug}
                    {dirty && <span className="text-amber-600 ml-1.5">(will change from /{cat.slug})</span>}
                  </p>
                </div>
                {dirty && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => save(cat)}
                      disabled={busyId === cat.id}
                      className="flex items-center gap-1.5 bg-accent text-primary text-xs font-bold px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-60 cursor-pointer"
                    >
                      {busyId === cat.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                      Save
                    </button>
                    <button
                      onClick={() => setEdits((e) => ({ ...e, [cat.id]: undefined }))}
                      className="p-1.5 text-gray-400 hover:text-primary cursor-pointer"
                      aria-label="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

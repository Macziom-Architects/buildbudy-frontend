"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Search, Loader2, Pencil, Trash2, X, ImageOff } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { apiGet } from "@/lib/api/client";
import {
  adminListProducts, adminCreateProduct, adminUpdateProduct,
  adminDeleteProduct, reindexSearch,
} from "@/lib/api/admin";

const PAGE_SIZE = 20;

const paiseToRupees = (p) => (p == null ? "" : (Number(p) / 100).toFixed(2));
const rupeesToPaise = (r) => Math.round(parseFloat(r) * 100);

function formatPrice(paise) {
  if (paise == null) return "—";
  return `₹${(Number(paise) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Product create/edit modal ──────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "", categoryId: "", hsnCode: "", unitOfMeasure: "piece",
  description: "", priceRupees: "", imageUrls: "", isActive: true,
};

function ProductModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState(
    isEdit
      ? {
          name: product.name ?? "",
          categoryId: product.categoryId ?? "",
          hsnCode: product.hsnCode ?? "",
          unitOfMeasure: product.unitOfMeasure ?? "piece",
          description: product.description ?? "",
          priceRupees: paiseToRupees(product.pricePaise),
          imageUrls: product.primaryImage ?? "",
          isActive: product.isActive,
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.categoryId || !form.hsnCode.trim()) {
      setError("Name, category and HSN code are required.");
      return;
    }
    const body = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      hsnCode: form.hsnCode.trim(),
      unitOfMeasure: form.unitOfMeasure.trim() || "piece",
      description: form.description,
      imageUrls: form.imageUrls.split("\n").map((u) => u.trim()).filter(Boolean),
      isActive: form.isActive,
    };
    if (form.priceRupees !== "") {
      const paise = rupeesToPaise(form.priceRupees);
      if (!Number.isFinite(paise) || paise <= 0) {
        setError("Price must be a positive number.");
        return;
      }
      body.pricePaise = paise;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateProduct(product.id, body);
      } else {
        await adminCreateProduct(body);
      }
      reindexSearch();
      onSaved();
    } catch (err) {
      setError(err?.message || "Save failed.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-primary">{isEdit ? "Edit product" : "New product"}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-primary cursor-pointer" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-primary">Name *</label>
            <input
              type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary">Category *</label>
              <select
                value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-md px-2 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Select…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-primary">Price (₹)</label>
              <input
                type="number" step="0.01" min="0" value={form.priceRupees}
                onChange={(e) => set("priceRupees", e.target.value)}
                placeholder="e.g. 499.00"
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-primary">HSN code *</label>
              <input
                type="text" value={form.hsnCode} onChange={(e) => set("hsnCode", e.target.value)}
                placeholder="e.g. 8205"
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
              <p className="text-[10px] text-muted mt-0.5">Must exist in gst_rates (drives the GST %).</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-primary">Unit</label>
              <input
                type="text" value={form.unitOfMeasure} onChange={(e) => set("unitOfMeasure", e.target.value)}
                placeholder="piece / kg / bag…"
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary">Description</label>
            <textarea
              rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary">Image URLs (one per line)</label>
            <textarea
              rows={2} value={form.imageUrls} onChange={(e) => set("imageUrls", e.target.value)}
              placeholder="https://…"
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent"
            />
            {isEdit && (
              <p className="text-[10px] text-amber-600 mt-0.5">
                Saving replaces the product&apos;s full image set with these URLs. Leave as-is to keep the current primary image.
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
            <input
              type="checkbox" checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="accent-[#F5B301]"
            />
            Visible in store
          </label>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-muted hover:text-primary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="flex items-center gap-2 bg-accent text-primary text-sm font-bold px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Products table ─────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState(null); // null = loading
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null); // null | "new" | product
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");
  const searchTimer = useRef(null);

  const load = useCallback(async (opts = {}) => {
    const params = { q, categoryId, page, limit: PAGE_SIZE, ...opts };
    try {
      const res = await adminListProducts(params);
      setProducts(res.products ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      setProducts([]);
      setNotice(err?.message || "Failed to load products.");
    }
  }, [q, categoryId, page]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    apiGet("/products/categories").then(setCategories).catch(() => {});
  }, []);

  function handleSearchInput(value) {
    setQ(value);
    setPage(1);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load({ q: value, page: 1 }), 350);
  }

  async function quickMove(product, newCategoryId) {
    if (!newCategoryId || newCategoryId === product.categoryId) return;
    setBusyId(product.id);
    try {
      await adminUpdateProduct(product.id, { categoryId: newCategoryId });
      reindexSearch();
      await load();
    } catch (err) {
      setNotice(err?.message || "Move failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(product) {
    setBusyId(product.id);
    try {
      await adminUpdateProduct(product.id, { isActive: !product.isActive });
      reindexSearch();
      await load();
    } catch (err) {
      setNotice(err?.message || "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? Products that were ever ordered are hidden instead of deleted.`)) return;
    setBusyId(product.id);
    try {
      const res = await adminDeleteProduct(product.id);
      reindexSearch();
      setNotice(res.outcome === "deactivated"
        ? `"${product.name}" has past orders — it was hidden from the store instead of deleted.`
        : `"${product.name}" deleted.`);
      await load();
    } catch (err) {
      setNotice(err?.message || "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold text-primary tracking-tight">Products</h1>
          <p className="text-xs text-muted mt-0.5">{total} products · edits reindex search automatically</p>
        </div>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 bg-accent text-primary text-sm font-bold px-4 py-2 rounded-md hover:opacity-90 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text" value={q} onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-white border border-gray-200 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {notice && (
        <div className="flex items-start justify-between gap-3 mb-3 text-xs text-primary bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} className="shrink-0 text-muted hover:text-primary cursor-pointer" aria-label="Dismiss">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        {products === null ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted text-center py-16">No products match.</p>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-100">
                <th className="px-4 py-2.5 font-semibold">Product</th>
                <th className="px-2 py-2.5 font-semibold">Category</th>
                <th className="px-2 py-2.5 font-semibold text-right">Price</th>
                <th className="px-2 py-2.5 font-semibold text-center">Status</th>
                <th className="px-2 py-2.5 font-semibold text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className={busyId === p.id ? "opacity-50" : ""}>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 shrink-0 bg-gray-50 border border-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {p.primaryImage
                          ? <SafeImage src={p.primaryImage} alt="" width={32} height={32} className="object-contain" />
                          : <ImageOff className="h-3.5 w-3.5 text-gray-300" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-primary truncate max-w-[280px]">{p.name}</p>
                        <p className="text-[10px] text-muted">HSN {p.hsnCode} · {p.unitOfMeasure}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <select
                      value={p.categoryId}
                      disabled={busyId === p.id}
                      onChange={(e) => quickMove(p, e.target.value)}
                      className="border border-gray-200 rounded px-1.5 py-1 text-xs bg-white focus:outline-none focus:border-accent cursor-pointer"
                    >
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2 text-right font-semibold text-primary whitespace-nowrap">
                    {formatPrice(p.pricePaise)}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => toggleActive(p)}
                      disabled={busyId === p.id}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                        p.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                      }`}
                      title="Click to toggle store visibility"
                    >
                      {p.isActive ? "LIVE" : "HIDDEN"}
                    </button>
                  </td>
                  <td className="px-2 py-2 pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setModal(p)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded cursor-pointer"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={busyId === p.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-md font-semibold text-primary disabled:opacity-40 cursor-pointer"
          >
            ← Prev
          </button>
          <span className="text-xs text-muted">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-md font-semibold text-primary disabled:opacity-40 cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      {modal && (
        <ProductModal
          product={modal === "new" ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}

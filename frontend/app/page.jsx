"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";
import Charts from "../components/Charts";

const API_BASE = "http://localhost:8000";

export default function HomePage() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [monthlyLimit, setMonthlyLimit] = useState(() => {
    try {
      const v = localStorage.getItem("monthlyLimit");
      return v !== null ? Number(v) : 1500;
    } catch {
      return 1500;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("monthlyLimit", String(monthlyLimit));
    } catch {
      // ignore storage errors
    }
  }, [monthlyLimit]);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // mark component as mounted so theme-dependent UI only renders on client
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const loadExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/expenses`);
      if (!response.ok) throw new Error("Unable to load expenses.");
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const normalizeError = (error) => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  };

  const formatPayloadItem = (item) => {
    if (typeof item === "string") return item;
    if (item instanceof Error) return item.message;
    try {
      return JSON.stringify(item);
    } catch {
      return String(item);
    }
  };

  const parseApiError = async (response) => {
    try {
      const payload = await response.json();
      if (payload?.detail) {
        if (typeof payload.detail === "string") return payload.detail;
        if (Array.isArray(payload.detail)) return payload.detail.map(formatPayloadItem).join(" | ");
        return formatPayloadItem(payload.detail);
      }
      if (payload?.message) return String(payload.message);
      if (typeof payload === "string") return payload;
      return formatPayloadItem(payload);
    } catch {
      const text = await response.text();
      return text || response.statusText || "Unknown error.";
    }
  };

  const loadSummary = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/expenses/summary`);
      if (!response.ok) throw new Error("Unable to load summary data.");
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(normalizeError(err));
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([loadExpenses(), loadSummary()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // derive months and categories from expenses
  const months = Array.from(
    new Set(
      expenses.map((e) => {
        try {
          return e.date.slice(0, 7); // YYYY-MM
        } catch {
          return null;
        }
      }).filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a));

  const categories = Array.from(new Set(expenses.map((e) => e.category))).sort();

  const filteredExpenses = expenses.filter((e) => {
    if (selectedMonth !== "all" && !e.date.startsWith(selectedMonth)) return false;
    if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
    return true;
  });

  // compute monthly total for budget alert (selectedMonth or overall if 'all')
  const monthlyTotal = expenses
    .filter((e) => (selectedMonth === "all" ? true : e.date.startsWith(selectedMonth)))
    .reduce((s, it) => s + Number(it.amount || 0), 0);

  // chart data should reflect selectedMonth filter as well — aggregate locally from filteredExpenses
  const summaryByCategory = (() => {
    const map = new Map();
    filteredExpenses.forEach((e) => {
      const c = e.category || "Misc";
      map.set(c, (map.get(c) || 0) + Number(e.amount || 0));
    });
    return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  })();

  const handleCreate = async (expense) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        const message = await parseApiError(response);
        throw new Error(message || "Failed to add expense.");
      }

      await refreshData();
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (expenseId, expense) => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/expenses/${expenseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        const message = await parseApiError(response);
        throw new Error(message || "Failed to update expense.");
      }

      setEditingExpense(null);
      await refreshData();
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (expenseId) => {
    setDeletingId(expenseId);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await parseApiError(response);
        throw new Error(message || "Failed to delete expense.");
      }

      await refreshData();
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">SpendWise</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                Expense dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
                Track expenses, add new entries, and review aggregated category totals for your charts.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-slate-900 px-5 py-3 text-slate-100 shadow-lg shadow-slate-200/50">
                {loading ? "Loading data..." : `${expenses.length} expenses loaded`}
              </div>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
              >
                {mounted ? (theme === "dark" ? "🌙 Dark" : "☀️ Light") : null}
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-700 ring-1 ring-rose-200">
              {error}
            </div>
          ) : null}

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Expense summary</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Category totals for your charts.</p>
                </div>
              </div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-sm text-slate-600 dark:text-slate-300">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100"
                  >
                    <option value="all">All</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <label className="ml-4 text-sm text-slate-600 dark:text-slate-300">Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100"
                  >
                    <option value="all">All</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Monthly total: <span className="font-semibold">${monthlyTotal.toFixed(2)}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Monthly limit:
                    <input
                      type="number"
                      min="0"
                      value={monthlyLimit}
                      onChange={(e) => setMonthlyLimit(Number(e.target.value || 0))}
                      className="ml-2 inline-flex w-28 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>
              {monthlyTotal > monthlyLimit ? (
                <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900 dark:text-rose-200 dark:ring-rose-700">
                  Budget Alert: You have exceeded your monthly limit!
                </div>
              ) : null}

              <Charts summary={summaryByCategory.length ? summaryByCategory : summary} />
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  {editingExpense ? "Edit expense" : "Add new expense"}
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {editingExpense
                    ? "Update the selected transaction or cancel editing."
                    : "Use the form to capture a transaction quickly."}
                </p>
                <ExpenseForm
                  onCreate={handleCreate}
                  onUpdate={handleUpdate}
                  onCancel={() => setEditingExpense(null)}
                  submitting={submitting}
                  initialExpense={editingExpense}
                />
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Recent expenses</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Delete an item to refresh the list automatically.</p>
                <ExpenseTable
                  expenses={filteredExpenses}
                  onDelete={handleDelete}
                  onEdit={setEditingExpense}
                  deletingId={deletingId}
                  loading={loading}
                  months={months}
                  categories={categories}
                  selectedMonth={selectedMonth}
                  selectedCategory={selectedCategory}
                  onMonthChange={(value) => setSelectedMonth(value)}
                  onCategoryChange={(value) => setSelectedCategory(value)}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

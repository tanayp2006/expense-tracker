"use client";

import { useState } from "react";

export default function ExpenseTable({
  expenses,
  onDelete,
  onEdit,
  deletingId,
  loading,
  months,
  categories,
  selectedMonth,
  selectedCategory,
  onMonthChange,
  onCategoryChange,
}) {
  const [activeDescriptionId, setActiveDescriptionId] = useState(null);

  const filteredExpenses = expenses.filter((expense) => {
    if (selectedMonth !== "all" && !expense.date.startsWith(selectedMonth)) return false;
    if (selectedCategory !== "all" && expense.category !== selectedCategory) return false;
    return true;
  });

  const toggleDescription = (id) => {
    setActiveDescriptionId((current) => (current === id ? null : id));
  };

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
          <span className="font-semibold">Filters:</span>
          <label className="flex items-center gap-2">
            Month:
              <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="all">All</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Category:
              <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left">
        <thead className="bg-slate-900 text-sm text-slate-100">
          <tr>
            <th className="px-4 py-4">Title</th>
            <th className="px-4 py-4">Category</th>
            <th className="px-4 py-4">Amount</th>
            <th className="px-4 py-4">Date</th>
            <th className="px-4 py-4">Description</th>
            <th className="px-4 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
              <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                Loading expenses...
              </td>
            </tr>
          ) : filteredExpenses.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                No expenses logged yet.
              </td>
            </tr>
          ) : (
            filteredExpenses.flatMap((expense) => [
              <tr key={expense.id} className="border-t border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                <td className="px-4 py-4 text-sm text-slate-800 dark:text-slate-100">{expense.title}</td>
                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{expense.category}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-slate-50">${expense.amount.toFixed(2)}</td>
                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{expense.date}</td>
                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {expense.description ? (
                    <button
                      type="button"
                      onClick={() => toggleDescription(expense.id)}
                      className="text-sm font-medium text-slate-900 dark:text-slate-100 underline-offset-4 transition hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      {activeDescriptionId === expense.id ? "Hide" : "View"}
                    </button>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">No description</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 space-x-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(expense)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 transition hover:bg-slate-200 dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-slate-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(expense.id)}
                    disabled={deletingId === expense.id}
                    className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:bg-rose-100"
                  >
                    {deletingId === expense.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>,
                activeDescriptionId === expense.id && expense.description ? (
                <tr key={`${expense.id}-description`} className="bg-slate-50 dark:bg-slate-800">
                  <td colSpan="6" className="px-4 py-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Description</div>
                      <p className="dark:text-slate-200">{expense.description}</p>
                    </div>
                  </td>
                </tr>
              ) : null,
            ])
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const categories = [
  "Food",
  "Rent",
  "Entertainment",
  "Transport",
  "Utilities",
  "Misc",
];

export default function ExpenseForm({ onCreate, onUpdate, onCancel, submitting, initialExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title ?? "");
      setAmount(initialExpense.amount?.toString() ?? "");
      setCategory(initialExpense.category ?? categories[0]);
      setDate(initialExpense.date ?? "");
      setDescription(initialExpense.description ?? "");
      setFormError("");
    } else {
      setTitle("");
      setAmount("");
      setCategory(categories[0]);
      setDate("");
      setDescription("");
      setFormError("");
    }
  }, [initialExpense]);

  const sanitizeDateValue = (value) => {
    if (!value) return "";

    const parts = value.split("-").map((part, index) => {
      if (index === 0) {
        return part.length > 4 ? part.slice(-4) : part;
      }
      return part.length > 2 ? part.slice(-2) : part;
    });

    return parts.filter(Boolean).join("-");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    if (!category) {
      setFormError("Category is required.");
      return;
    }

    if (!date) {
      setFormError("Date is required.");
      return;
    }

    const expensePayload = {
      title: title.trim(),
      amount: numericAmount,
      category,
      date,
      description: description.trim() || null,
    };

    if (initialExpense && onUpdate) {
      await onUpdate(initialExpense.id, expensePayload);
    } else if (onCreate) {
      await onCreate(expensePayload);
    }

    if (!initialExpense) {
      setTitle("");
      setAmount("");
      setCategory(categories[0]);
      setDate("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {formError ? (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900 dark:text-rose-200 dark:ring-rose-700">
          {formError}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
            placeholder="Lunch with team"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
            placeholder="35.00"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(sanitizeDateValue(e.target.value))}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
          placeholder="Optional note about this expense"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? "Saving..." : initialExpense ? "Update expense" : "Add expense"}
        </button>
        {initialExpense && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
}

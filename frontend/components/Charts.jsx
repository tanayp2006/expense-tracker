"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#6366F1", "#EF4444", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6", "#F97316"];

export default function Charts({ summary }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(() => update());
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  // summary: [{ category: string, total: number }, ...]
  const total = summary.reduce((s, it) => s + (it.total || 0), 0);

  const pieData = summary.map((s) => ({ name: s.category, value: s.total }));
  const barData = summary.map((s) => ({ category: s.category, total: s.total }));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Spending by category</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} label={(entry) => `${Math.round((entry.value / total) * 100)}%`}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip
                formatter={(value) => `$${Number(value).toFixed(2)}`}
                contentStyle={{ backgroundColor: isDark ? "#0f172a" : "#fff", borderColor: isDark ? "#334155" : "#e5e7eb", color: isDark ? "#cbd5e1" : "#111827" }}
                itemStyle={{ color: isDark ? "#cbd5e1" : undefined }}
              />
              <Legend wrapperStyle={{ color: isDark ? "#cbd5e1" : undefined }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Total by category</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : undefined} />
              <XAxis dataKey="category" stroke={isDark ? "#94a3b8" : undefined} tick={{ fill: isDark ? "#cbd5e1" : undefined }} />
              <YAxis stroke={isDark ? "#94a3b8" : undefined} tick={{ fill: isDark ? "#cbd5e1" : undefined }} />
              <ReTooltip formatter={(value) => `$${Number(value).toFixed(2)}`} contentStyle={{ backgroundColor: isDark ? "#0f172a" : "#fff", borderColor: isDark ? "#334155" : "#e5e7eb", color: isDark ? "#cbd5e1" : "#111827" }} />
              <Bar dataKey="total" fill="#6366F1" cursor={{ fill: isDark ? '#0b1220' : '#f3f4f6' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

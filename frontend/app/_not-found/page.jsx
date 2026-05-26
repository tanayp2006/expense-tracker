"use client";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="max-w-2xl p-8 text-center">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">The page you requested could not be found.</p>
      </div>
    </main>
  );
}

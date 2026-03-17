"use client";

import { useMemo, useState } from "react";

export default function Home() {
  const [conflict, setConflict] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const pretty = useMemo(() => {
    if (!result) return "";
    return JSON.stringify(result, null, 2);
  }, [result]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conflict }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setResult(data);
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Kyle</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Paste a conflict description. Kyle will return strategic analysis,
            predicted outcomes, and market impacts.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="conflict"
              className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Conflict description
            </label>
            <textarea
              id="conflict"
              name="conflict"
              rows={8}
              value={conflict}
              onChange={(e) => setConflict(e.target.value)}
              placeholder="Describe the conflict scenario, actors, objectives, constraints, and recent events..."
              className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-600 dark:focus:border-zinc-700"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              Uses `POST /api/analyze`
            </div>
          </div>
        </form>

        <section className="space-y-2">
          <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Response
          </h2>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-950/50 dark:bg-red-950/30 dark:text-red-100">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="grid gap-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="text-xs font-medium text-zinc-500">
                  strategic_analysis
                </div>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {result.strategic_analysis}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="text-xs font-medium text-zinc-500">
                  predicted_outcomes
                </div>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {result.predicted_outcomes}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="text-xs font-medium text-zinc-500">
                  market_impacts
                </div>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {result.market_impacts}
                </div>
              </div>

              <details className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <summary className="cursor-pointer text-sm font-medium">
                  Raw JSON
                </summary>
                <pre className="mt-3 overflow-auto text-xs leading-5 text-zinc-700 dark:text-zinc-300">
                  {pretty}
                </pre>
              </details>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              Submit a description to see results here.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

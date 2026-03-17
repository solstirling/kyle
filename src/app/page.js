"use client";

import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";

function CollapsibleCard({ title, children, initialOpen = true }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <details
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
      className="group rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 transition group-open:rotate-180 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </summary>
      <div className="px-4 pb-4 pt-1">{children}</div>
    </details>
  );
}

function MarkdownBody({ children }) {
  return (
    <div className="prose prose-zinc max-w-none text-sm leading-6 dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-2">
      <ReactMarkdown>{children || ""}</ReactMarkdown>
    </div>
  );
}

function SkeletonCard({ title }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-3 w-9/12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      </div>
      <div className="sr-only">{title}</div>
    </div>
  );
}

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

          {isLoading ? (
            <div className="grid gap-4">
              <SkeletonCard title="Strategic Analysis" />
              <SkeletonCard title="Predicted Outcomes" />
              <SkeletonCard title="Market Impact" />
            </div>
          ) : result ? (
            <div className="grid gap-4">
              <CollapsibleCard title="Strategic Analysis" initialOpen={true}>
                <MarkdownBody>{result.strategic_analysis}</MarkdownBody>
              </CollapsibleCard>
              <CollapsibleCard title="Predicted Outcomes" initialOpen={true}>
                <MarkdownBody>{result.predicted_outcomes}</MarkdownBody>
              </CollapsibleCard>
              <CollapsibleCard title="Market Impact" initialOpen={true}>
                <MarkdownBody>{result.market_impacts}</MarkdownBody>
              </CollapsibleCard>

              <CollapsibleCard title="Raw JSON" initialOpen={false}>
                <pre className="overflow-auto text-xs leading-5 text-zinc-700 dark:text-zinc-300">
                  {pretty}
                </pre>
              </CollapsibleCard>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              Submit a description to see results here.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

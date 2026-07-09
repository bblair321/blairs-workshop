import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: { href: string; label: string };
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-6 w-6"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <p className="font-medium text-zinc-700 dark:text-zinc-300">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      )}
      {action && (
        <Link href={action.href} className="btn-primary mt-6 inline-flex items-center gap-1">
          {action.label}
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

import { SearchX, RefreshCcw } from "lucide-react";

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-border rounded-3xl bg-secondary/20">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 text-primary/40 mb-6">
        <SearchX className="h-10 w-10" />
      </div>
      <h3 className="font-display text-2xl font-bold text-foreground">No matches found</h3>
      <p className="mt-2 text-muted-foreground max-w-sm mx-auto leading-relaxed">
        We couldn't find any diagnostic tests matching your search criteria. 
        Try adjusting your filters or search term.
      </p>
      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-glow hover:opacity-90 transition-all"
      >
        <RefreshCcw className="h-4 w-4" />
        Reset All Filters
      </button>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-soft animate-pulse">
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
        <div className="h-7 w-3/4 bg-muted rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
        <div className="pt-5 border-t border-border flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-6 w-16 bg-muted rounded" />
          </div>
          <div className="h-10 w-10 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ServiceGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

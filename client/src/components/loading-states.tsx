import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProfileSelectionSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <Skeleton className="h-10 w-48 mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <Skeleton className="w-32 h-32 rounded-md" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 6, isKidsMode = false }: { count?: number; isKidsMode?: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4 lg:px-8">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "aspect-[2/3]",
            isKidsMode && "rounded-xl"
          )}
        >
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function MovieRowSkeleton({ title, isKidsMode = false }: { title: string; isKidsMode?: boolean }) {
  return (
    <section className="mb-8">
      <h2 className={cn(
        "text-xl font-semibold mb-4 px-4 lg:px-8",
        isKidsMode && "text-2xl"
      )}>
        {title}
      </h2>
      <div className="flex gap-3 px-4 lg:px-8 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-shrink-0",
              isKidsMode ? "w-44 md:w-52" : "w-36 md:w-44"
            )}
          >
            <Skeleton className="aspect-[2/3] rounded-md" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] bg-gradient-to-br from-card to-background">
      <div className="absolute inset-0 flex items-center px-4 lg:px-8">
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-16 w-3/4" />
          <div className="flex gap-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FullPageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

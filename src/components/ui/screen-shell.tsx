import { cn } from "@/lib/utils";

interface ScreenShellProps {
  children: React.ReactNode;
  className?: string;
}

/** Shared mobile screen container: warm background, decorative gradient, consistent gutters. */
export function ScreenShell({ children, className }: ScreenShellProps) {
  return (
    <main
      className={cn(
        "relative mx-auto flex w-full max-w-md min-h-dvh flex-col overflow-x-clip bg-paper px-4 pb-14 pt-6 sm:px-6",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-72 w-[130%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(60%_58%_at_50%_28%,rgba(47,85,212,0.09),transparent_72%)]" />
        <div className="absolute -top-12 right-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(18,133,94,0.07),transparent_70%)]" />
      </div>
      <div className="relative flex flex-1 flex-col">{children}</div>
    </main>
  );
}
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-gold tabular-nums",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gold text-[#0d0c0a] font-semibold",
        secondary: "border-hairline bg-surface-2 text-foreground",
        destructive: "border-transparent bg-vermilion text-[#f2ece1]",
        outline: "border-hairline bg-surface-1/90 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

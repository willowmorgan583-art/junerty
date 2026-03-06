import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

const sizeMap = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 32, text: "text-lg" },
  lg: { icon: 40, text: "text-2xl" },
  xl: { icon: 48, text: "text-3xl" },
};

export function BrandLogo({
  size = "md",
  showText = true,
  className,
  textClassName,
}: BrandLogoProps) {
  const s = sizeMap[size];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/synthgraphix-logo.svg"
        alt="SYNTHGRAPHIX"
        width={s.icon}
        height={s.icon}
        className="shrink-0"
        priority
      />
      {showText && (
        <span
          className={cn(
            "brand-3d font-extrabold tracking-tight select-none",
            s.text,
            textClassName
          )}
        >
          SYNTHGRAPHIX
        </span>
      )}
    </span>
  );
}

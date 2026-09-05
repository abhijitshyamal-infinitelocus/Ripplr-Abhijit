import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { cn } from "@/lib/utils";
import type { TextPart } from "@/lib/content";

type Props = {
  eyebrow?: string;
  title?: string;
  titleParts?: TextPart[];
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  accent?: "warm" | "cool";
  size?: "md" | "lg";
  className?: string;
};

/** Eyebrow + split-reveal headline + description, used to open every section. */
export function SectionHeader({
  eyebrow,
  title,
  titleParts,
  description,
  align = "left",
  tone = "dark",
  accent = "warm",
  size = "lg",
  className,
}: Props) {
  const accentClass = accent === "warm" ? "text-gradient-warm" : "text-gradient-cool";
  const text = titleParts
    ? titleParts.map((p) => ({ text: p.t, className: p.accent ? accentClass : undefined }))
    : title ?? "";
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        tone === "dark" ? "text-paper" : "text-navy",
        className,
      )}
    >
      {eyebrow && (
        <Reveal y={16} blur={false}>
          <span className={cn("eyebrow", accent === "warm" ? "text-orange" : "text-teal")}>{eyebrow}</span>
        </Reveal>
      )}
      {(title || titleParts) && (
        <SplitText text={text} as="h2" className={cn(size === "lg" ? "display-lg" : "display-md", "max-w-[18ch]")} />
      )}
      {description && (
        <Reveal delay={0.2} y={20}>
          <p className={cn("max-w-[56ch] text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-paper/65" : "text-navy/65")}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

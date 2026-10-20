import type { ReactNode } from "react";
import { useReveal } from "~/hooks/useReveal";

type Props = { children: ReactNode; className?: string; as?: "div" | "li" | "section" | "article" };

/** Wrapper that fades its content in once when scrolled into view. */
export function Reveal({ children, className, as: Tag = "div" }: Props) {
  const ref = useReveal<HTMLElement>();
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}

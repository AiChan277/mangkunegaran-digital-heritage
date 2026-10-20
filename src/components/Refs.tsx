import { Fragment } from "react";
import { useT } from "~/i18n/useT";

type Props = { factIds?: readonly string[]; byFact: Record<string, number[]> };

/** Superscript source numbers linking to the page's source list. */
export function Refs({ factIds = [], byFact }: Props) {
  const t = useT();
  const nums = [...new Set(factIds.flatMap((f) => byFact[f] ?? []))].sort((a, b) => a - b);
  if (!nums.length) return null;
  return (
    <>
      {nums.map((n, i) => (
        <Fragment key={n}>
          <a className="fn" href={`#src-${n}`} aria-label={t("sources.refLabel", { n })}>
            {n}
          </a>
          {i < nums.length - 1 ? <span className="fn" aria-hidden="true">,</span> : null}
        </Fragment>
      ))}
    </>
  );
}

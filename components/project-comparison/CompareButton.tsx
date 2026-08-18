"use client";

import { useCompare } from "./CompareProvider";

type Props = {
  projectSlug: string;
  className?: string;
  label?: string;
};

export default function CompareButton({ projectSlug, className, label = "Compare Project" }: Props) {
  const { openSelector, selectedSlugs } = useCompare();
  const selected = selectedSlugs.includes(projectSlug);

  return (
    <button
      type="button"
      className={className}
      onClick={() => openSelector(projectSlug)}
      aria-pressed={selected}
      aria-haspopup="dialog"
    >
      {selected ? "Selected to Compare" : label}
    </button>
  );
}

interface AxisLineProps {
  /** Line direction */
  direction: "horizontal" | "vertical";
  className?: string;
  /** Line color. Default: cyan accent (#5DADE2) */
  color?: string;
}

/**
 * Pure RSC decorative axis line.
 * Renders a thin line that evokes engineering blueprint axes.
 */
export function AxisLine({
  direction,
  className,
  color = "var(--color-cyan-accent, #5DADE2)",
}: AxisLineProps) {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundColor: color,
        ...(isHorizontal
          ? { width: "100%", height: "1px" }
          : { width: "1px", height: "100%" }),
        transformOrigin: isHorizontal ? "left" : "top",
      }}
      data-axis-line
    />
  );
}

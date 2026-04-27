interface GridOverlayProps {
  className?: string;
  /** Grid line opacity (0-1). Default: 0.05 */
  opacity?: number;
  /** Grid line color. Default: currentColor */
  color?: string;
  /** Grid spacing in px. Default: 60 */
  spacing?: number;
}

/**
 * Pure RSC decorative grid overlay.
 * Renders a subtle grid pattern using CSS repeating-linear-gradient.
 * Evokes engineering blueprint / technical drawing aesthetics.
 */
export function GridOverlay({
  className,
  opacity = 0.05,
  color = "currentColor",
  spacing = 60,
}: GridOverlayProps) {
  const lineColor =
    color === "currentColor"
      ? `rgba(44, 62, 80, ${opacity})`
      : color;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: [
          `repeating-linear-gradient(0deg, ${lineColor} 0px, ${lineColor} 1px, transparent 1px, transparent ${spacing}px)`,
          `repeating-linear-gradient(90deg, ${lineColor} 0px, ${lineColor} 1px, transparent 1px, transparent ${spacing}px)`,
        ].join(", "),
      }}
    />
  );
}

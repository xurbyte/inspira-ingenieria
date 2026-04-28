interface CornerBracketProps {
  /** Bracket position */
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Bracket arm length in px. Default: 24 */
  size?: number;
  className?: string;
  /** Bracket color. Default: cyan accent */
  color?: string;
}

/**
 * Pure RSC decorative corner bracket.
 * Renders L-shaped corner marks like engineering drawing dimension indicators.
 */
export function CornerBracket({
  position,
  size = 24,
  className,
  color = "var(--color-cyan-accent, #2E98C5)",
}: CornerBracketProps) {
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");

  // Each bracket is made of two borders that form an L-shape
  const borderProps: React.CSSProperties = {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    [isTop ? "top" : "bottom"]: 0,
    [isLeft ? "left" : "right"]: 0,
  };

  switch (position) {
    case "top-left":
      borderProps.borderTopWidth = "1px";
      borderProps.borderLeftWidth = "1px";
      break;
    case "top-right":
      borderProps.borderTopWidth = "1px";
      borderProps.borderRightWidth = "1px";
      break;
    case "bottom-left":
      borderProps.borderBottomWidth = "1px";
      borderProps.borderLeftWidth = "1px";
      break;
    case "bottom-right":
      borderProps.borderBottomWidth = "1px";
      borderProps.borderRightWidth = "1px";
      break;
  }

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        ...borderProps,
        pointerEvents: "none",
      }}
      data-corner-bracket
    />
  );
}

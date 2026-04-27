"use client";

import type { ReactNode } from "react";

interface SmoothScrollLinkProps {
  /** ID of the target element to scroll to */
  targetId: string;
  children: ReactNode;
  className?: string;
  /** Optional callback (e.g., to close mobile menu after click) */
  onClick?: () => void;
}

export function SmoothScrollLink({
  targetId,
  children,
  className,
  onClick,
}: SmoothScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    onClick?.();
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}

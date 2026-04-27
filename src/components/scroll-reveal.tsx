"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** IntersectionObserver threshold (0-1). Default: 0.1 */
  threshold?: number;
  /** IntersectionObserver rootMargin. Default: "0px" */
  rootMargin?: string;
  /** Enable staggered reveal for direct children. Default: false */
  stagger?: boolean;
  /** Delay in ms between staggered children. Default: 120 */
  staggerDelay?: number;
  /** HTML tag for the wrapper element. Default: "div" */
  as?: ElementType;
  /** Fire intersection only once. Default: true */
  once?: boolean;
}

export function ScrollReveal({
  children,
  className,
  threshold = 0.1,
  rootMargin = "0px",
  stagger = false,
  staggerDelay = 120,
  as: Tag = "div",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (stagger) {
            const childElements = element.children;
            for (let i = 0; i < childElements.length; i++) {
              childElements[i].setAttribute("data-stagger-index", String(i));
              (
                childElements[i] as HTMLElement
              ).style.transitionDelay = `${i * staggerDelay}ms`;
            }
          }

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);

          if (stagger) {
            const childElements = element.children;
            for (let i = 0; i < childElements.length; i++) {
              childElements[i].removeAttribute("data-stagger-index");
              (childElements[i] as HTMLElement).style.transitionDelay = "";
            }
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, stagger, staggerDelay, once]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      data-visible={isVisible ? "true" : "false"}
      className={className}
    >
      {children}
    </Tag>
  );
}

'use client';

import { unstable_ViewTransition as ViewTransition } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface ConditionalViewTransitionProps {
  children: React.ReactNode;
}

export function ConditionalViewTransition({ children }: ConditionalViewTransitionProps) {
  const pathname = usePathname();
  const previousPathRef = useRef<string>('');

  useEffect(() => {
    previousPathRef.current = pathname;
  }, [pathname]);

  // Enable view transitions for navigation between project pages
  const shouldEnableTransitions = (() => {
    // Current path patterns for project listings
    const projectListingPatterns = [
      /^\/proyectos\/viviendas$/,
      /^\/proyectos\/funcional$/,
      /^\/proyectos\/naves-industriales$/
    ];

    // Current path pattern for project detail pages
    const projectDetailPattern = /^\/proyectos\/[^\/]+\/[^\/]+$/;

    // Check if current path is a project detail page
    const isCurrentDetailPage = projectDetailPattern.test(pathname);

    // Check if current path is a project listing page
    const isCurrentListingPage = projectListingPatterns.some(pattern => pattern.test(pathname));

    // Check if previous path was a project listing page
    const wasPreviousListingPage = projectListingPatterns.some(pattern => pattern.test(previousPathRef.current));

    // Check if previous path was a project detail page
    const wasPreviousDetailPage = projectDetailPattern.test(previousPathRef.current);

    // Enable transitions for:
    // 1. Listing page → Detail page
    // 2. Detail page → Listing page
    const isValidTransition = (isCurrentDetailPage && wasPreviousListingPage) ||
                             (isCurrentListingPage && wasPreviousDetailPage);

    return isValidTransition;
  })();

  if (shouldEnableTransitions) {
    return <ViewTransition>{children}</ViewTransition>;
  }

  return <>{children}</>;
}

'use client';

import { unstable_ViewTransition as ViewTransition } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ConditionalViewTransitionProps {
  children: React.ReactNode;
}

export function ConditionalViewTransition({ children }: ConditionalViewTransitionProps) {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string>('');

  useEffect(() => {
    setPreviousPath(pathname);
  }, [pathname]);

  // Enable view transitions only for navigation from project listing pages to detail pages
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

    // Check if previous path was a project listing page
    const wasPreviousListingPage = projectListingPatterns.some(pattern => pattern.test(previousPath));

    return isCurrentDetailPage && wasPreviousListingPage;
  })();

  if (shouldEnableTransitions) {
    return <ViewTransition>{children}</ViewTransition>;
  }

  return <>{children}</>;
}

import { Suspense, type ReactNode } from 'react';

export function LazyBoundary({
    children,
    fallback = null,
}: {
    children: ReactNode;
    fallback?: ReactNode;
}) {
    return <Suspense fallback={fallback}>{children}</Suspense>;
}

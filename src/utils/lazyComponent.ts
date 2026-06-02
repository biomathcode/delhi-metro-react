import { lazy, type ComponentType } from 'react';

export const createLazyComponent = <TProps extends object>(
    loader: () => Promise<{ default: ComponentType<TProps> }>
) => lazy(loader);

import { useSyncExternalStore } from 'react';

const getPathname = () => window.location.pathname;
const getServerPathname = () => '/';

const subscribeToPathname = (callback: () => void) => {
    window.addEventListener('popstate', callback);
    return () => window.removeEventListener('popstate', callback);
};

export const usePathname = () =>
    useSyncExternalStore(subscribeToPathname, getPathname, getServerPathname);

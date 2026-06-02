import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { use, type ReactNode } from 'react';

import { useI18n } from '../i18n';
import { getStationPathname } from '../utils/routePlanner';
import { getStationInfoBySlug } from '../utils/stationMetadata';
import StationDetails from './StationDetails';

function PlannerLink({ href = '/', children }: { href?: string; children: ReactNode }) {
    return (
        <a
            href={href}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
        >
            <ArrowLeftIcon />
            {children}
        </a>
    );
}

function StationNotFound() {
    return (
        <main className="min-h-svh bg-[#f4f0e8] p-4 text-neutral-950 dark:bg-zinc-950 dark:text-zinc-50 sm:p-6">
            <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-3xl place-items-center rounded-lg border border-neutral-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900 sm:min-h-[calc(100svh-3rem)]">
                <div className="grid gap-4">
                    <p className="text-xs font-semibold uppercase text-[#009b50] dark:text-emerald-400">Station not found</p>
                    <h1 className="text-3xl font-semibold">This station page is not available.</h1>
                    <p className="text-sm text-neutral-600 dark:text-zinc-400">Open the planner to search the Delhi Metro network.</p>
                    <div className="flex justify-center">
                        <PlannerLink>Back to planner</PlannerLink>
                    </div>
                </div>
            </div>
        </main>
    );
}

function StationPage({ slug }: { slug: string }) {
    const { language } = useI18n();
    const station = use(getStationInfoBySlug(slug));

    if (!station) return <StationNotFound />;

    return (
        <main className="min-h-svh bg-[#f4f0e8] p-3 text-neutral-950 dark:bg-zinc-950 dark:text-zinc-50 sm:p-6">
            <div className="mx-auto grid max-w-6xl gap-4">
                <nav className="flex flex-wrap items-center justify-between gap-3">
                    <PlannerLink>Back to planner</PlannerLink>
                    <a href="/" className="inline-flex h-10 items-center rounded-lg bg-neutral-900 px-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">Open planner</a>
                </nav>
                <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                    <StationDetails station={station} language={language} mode="page" />
                </div>
                <div className="text-center text-xs font-medium text-neutral-500 dark:text-zinc-500">
                    <a href={getStationPathname(station.id)}>{getStationPathname(station.id)}</a>
                </div>
            </div>
        </main>
    );
}

export default StationPage;
